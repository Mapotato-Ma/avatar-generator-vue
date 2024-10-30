/**
 * @description 截屏服务
 * @author Mapotato
 * @date 24/08/2023
 * @export
 * @class Screenshot
 */
export class Screenshot {
  videoElement!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D | null;
  constructor(videoElement: HTMLElement) {
    if (videoElement instanceof HTMLVideoElement) {
      this.videoElement = videoElement;
    } else {
      const getVideoElement = videoElement.getElementsByTagName('video')[0];
      this.videoElement = getVideoElement;
    }
    if (!this.videoElement) {
      console.log('🚀 ~ screenshot.service.ts ~ 13行\n', '未传入视频元素');
      return;
    }
    this.canvas = document.createElement('canvas');
    this.videoElement.addEventListener('loadeddata', () => {
      this.canvas.width = this.videoElement.videoWidth;
      this.canvas.height = this.videoElement.videoHeight;
    });
    this.context = this.canvas.getContext('2d');
  }

  /**
   * @description 视频截屏
   * @author Mapotato
   * @date 24/08/2023
   * @param {HTMLVideoElement} videoElement 视频元素
   * @param {number} [width=this.canvas.width] 截屏宽度，默认为视频宽度
   * @param {number} [height=this.canvas.height] 截屏高度，默认为视频高度
   * @returns {*}  {string}
   * @memberof Screenshot
   */
  computeFrame(
    videoElement: HTMLVideoElement,
    width: number = this.canvas.width,
    height: number = this.canvas.height,
  ): string {
    this.context?.drawImage(videoElement, 0, 0, width, height);
    return this.canvas.toDataURL('image/png');
  }
}
