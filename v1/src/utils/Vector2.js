/**
 * 파일 위치: src/utils/Vector2.js
 * 파일명: Vector2.js
 * 용도: 2D 벡터 연산
 * 기능: 벡터 생성, 연산(덧셈, 뺄셈, 곱셈, 정규화 등)
 * 책임: 게임 내 모든 위치, 방향, 속도 계산
 */

export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // 벡터 복사
  clone() {
    return new Vector2(this.x, this.y);
  }

  // 벡터 설정
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  // 다른 벡터로부터 값 복사
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  // 벡터 덧셈
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  // 벡터 뺄셈
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  // 스칼라 곱셈
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // 스칼라 나눗셈
  divide(scalar) {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  // 벡터 크기(길이)
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // 벡터 크기의 제곱 (sqrt 연산 생략, 성능 최적화)
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  // 정규화 (단위 벡터로 변환)
  normalize() {
    const mag = this.magnitude();
    if (mag > 0) {
      this.divide(mag);
    }
    return this;
  }

  // 거리 계산
  distance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 거리의 제곱 (성능 최적화)
  distanceSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  // 내적
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  // 벡터 각도 (라디안)
  angle() {
    return Math.atan2(this.y, this.x);
  }

  // 두 벡터 사이의 각도
  angleBetween(v) {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  // 벡터 회전
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newX = this.x * cos - this.y * sin;
    const newY = this.x * sin + this.y * cos;
    this.x = newX;
    this.y = newY;
    return this;
  }

  // 선형 보간
  lerp(v, t) {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  }

  // 벡터 제한 (최대 크기)
  limit(max) {
    const magSq = this.magnitudeSquared();
    if (magSq > max * max) {
      this.normalize().multiply(max);
    }
    return this;
  }

  // 0 벡터인지 확인
  isZero() {
    return this.x === 0 && this.y === 0;
  }

  // 문자열 변환
  toString() {
    return `Vector2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  // 정적 메서드: 새 벡터 생성
  static zero() {
    return new Vector2(0, 0);
  }

  static one() {
    return new Vector2(1, 1);
  }

  static up() {
    return new Vector2(0, -1);
  }

  static down() {
    return new Vector2(0, 1);
  }

  static left() {
    return new Vector2(-1, 0);
  }

  static right() {
    return new Vector2(1, 0);
  }

  // 정적 메서드: 두 벡터 간 연산 (새 벡터 반환)
  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  static multiply(v, scalar) {
    return new Vector2(v.x * scalar, v.y * scalar);
  }

  static distance(v1, v2) {
    return v1.distance(v2);
  }

  static distanceSquared(v1, v2) {
    return v1.distanceSquared(v2);
  }

  // 각도로부터 방향 벡터 생성
  static fromAngle(angle, length = 1) {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  // 랜덤 방향 벡터
  static random(length = 1) {
    const angle = Math.random() * Math.PI * 2;
    return Vector2.fromAngle(angle, length);
  }
}
