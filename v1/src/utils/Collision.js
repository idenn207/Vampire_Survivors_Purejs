/**
 * 파일위치: /src/utils/Collision.js
 * 파일명: Collision.js
 * 용도: 충돌 감지 유틸리티
 * 기능: 원-원, 원-박스, 박스-박스 충돌 감지
 * 책임: 충돌 판정 연산
 */

export default class Collision {
  /**
   * 원-원 충돌 감지
   * @param {Vector2} pos1 - 첫 번째 원의 위치
   * @param {number} radius1 - 첫 번째 원의 반지름
   * @param {Vector2} pos2 - 두 번째 원의 위치
   * @param {number} radius2 - 두 번째 원의 반지름
   * @returns {boolean}
   */
  static circleCircle(pos1, radius1, pos2, radius2) {
    const distSquared = pos1.distanceSquared(pos2);
    const radiusSum = radius1 + radius2;
    return distSquared < radiusSum * radiusSum;
  }

  /**
   * 원-박스 충돌 감지
   * @param {Vector2} circlePos - 원의 위치
   * @param {number} radius - 원의 반지름
   * @param {Vector2} boxPos - 박스의 위치 (중심)
   * @param {number} boxWidth - 박스의 너비
   * @param {number} boxHeight - 박스의 높이
   * @returns {boolean}
   */
  static circleBox(circlePos, radius, boxPos, boxWidth, boxHeight) {
    const halfWidth = boxWidth / 2;
    const halfHeight = boxHeight / 2;

    // 박스에서 가장 가까운 점 찾기
    const closestX = Math.max(boxPos.x - halfWidth, Math.min(circlePos.x, boxPos.x + halfWidth));
    const closestY = Math.max(boxPos.y - halfHeight, Math.min(circlePos.y, boxPos.y + halfHeight));

    // 거리 계산
    const dx = circlePos.x - closestX;
    const dy = circlePos.y - closestY;
    const distSquared = dx * dx + dy * dy;

    return distSquared < radius * radius;
  }

  /**
   * 박스-박스 충돌 감지 (AABB)
   * @param {Vector2} pos1 - 첫 번째 박스의 위치 (중심)
   * @param {number} width1 - 첫 번째 박스의 너비
   * @param {number} height1 - 첫 번째 박스의 높이
   * @param {Vector2} pos2 - 두 번째 박스의 위치 (중심)
   * @param {number} width2 - 두 번째 박스의 너비
   * @param {number} height2 - 두 번째 박스의 높이
   * @returns {boolean}
   */
  static boxBox(pos1, width1, height1, pos2, width2, height2) {
    const left1 = pos1.x - width1 / 2;
    const right1 = pos1.x + width1 / 2;
    const top1 = pos1.y - height1 / 2;
    const bottom1 = pos1.y + height1 / 2;

    const left2 = pos2.x - width2 / 2;
    const right2 = pos2.x + width2 / 2;
    const top2 = pos2.y - height2 / 2;
    const bottom2 = pos2.y + height2 / 2;

    return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);
  }

  /**
   * 점-박스 충돌 감지
   * @param {Vector2} point - 점의 위치
   * @param {Vector2} boxPos - 박스의 위치 (중심)
   * @param {number} boxWidth - 박스의 너비
   * @param {number} boxHeight - 박스의 높이
   * @returns {boolean}
   */
  static pointBox(point, boxPos, boxWidth, boxHeight) {
    const halfWidth = boxWidth / 2;
    const halfHeight = boxHeight / 2;

    return point.x >= boxPos.x - halfWidth && point.x <= boxPos.x + halfWidth && point.y >= boxPos.y - halfHeight && point.y <= boxPos.y + halfHeight;
  }

  /**
   * 점-원 충돌 감지
   * @param {Vector2} point - 점의 위치
   * @param {Vector2} circlePos - 원의 위치
   * @param {number} radius - 원의 반지름
   * @returns {boolean}
   */
  static pointCircle(point, circlePos, radius) {
    const distSquared = point.distanceSquared(circlePos);
    return distSquared < radius * radius;
  }
}
