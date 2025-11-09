/**
 * 파일위치: /src/ecs/components/Renderer.js
 * 파일명: Renderer.js
 * 용도: Renderer 컴포넌트
 * 기능: 렌더링 정보 (색상, 크기, 모양)
 * 책임: 엔티티의 시각적 표현
 */

import Component from '../Component.js';

export default class Renderer extends Component {
  constructor(shape = 'circle', color = '#ffffff', size = 32) {
    super();

    this.shape = shape; // 'circle' | 'rect' | 'triangle'
    this.color = color;
    this.size = size;
    this.width = size;
    this.height = size;

    this.stroke_color = null;
    this.stroke_width = 0;

    this.visible = true;
    this.alpha = 1.0; // 투명도 (0~1)
    this.z_index = 0; // 렌더링 순서
  }

  /**
   * 외곽선 설정
   * @param {string} color
   * @param {number} width
   */
  setStroke(color, width) {
    this.stroke_color = color;
    this.stroke_width = width;
  }

  /**
   * 투명도 설정
   * @param {number} alpha - 0~1
   */
  setAlpha(alpha) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }
}
