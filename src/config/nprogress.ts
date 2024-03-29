import Nprogress from 'nprogress';

Nprogress.configure({
    parent: 'body',
    minimum: 0.0001, // 初始化时的最小百分比
    showSpinner: false, // 关闭右侧转动的小圈
    easing: 'ease', // CSS3缓冲动画字符串 如 ease、linear、ease-in、ease-out、ease-in-out、cubic-bezier
    speed: 200, // 递增进度条的速度
    trickleSpeed: 200 // 自动递增间隔
});

export const start = () => {
    Nprogress.start();
};

export const done = () => {
    Nprogress.done();
};

export default Nprogress;
