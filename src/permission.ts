import router from '@/router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { start, done } from '@/config/nprogress';
// 单独导入，如果小仓库在大仓库外面，无法获取，需要有大仓库
import { useUserStore, usePermissionStore } from '@/store';
import { settingConfig } from '@/config/settings';

// 白名单
const whiteList = ['/login'];
// 判断路由是否已经添加
const registerRouteFresh = ref(true);

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // pinia搭配路由使用时，必须放在守卫里才行，不然外面pinia先加载会失效
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    const { title } = settingConfig;

    if (to.meta.title) {
        document.title = title + '-' + to.meta.title;
    }
    start();
    if (userStore.token) {
        if (to.path === '/login') {
            next({ path: '/' });
        } else {
            // TODO 待换为用户信息判断
            if (!userStore.userName) {
                await userStore.getUserInfo();
                const rewriteRoutes = await permissionStore.getAsyncRoutes();
                rewriteRoutes.forEach(route => {
                    router.addRoute(route as unknown as RouteRecordRaw);
                });
                registerRouteFresh.value = false;
                next({ path: to.path });
                // 刷新会导致空白页面
                // next({ ...to, replace: true });
            } else {
                next();
            }
        }
    } else {
        // 没有token
        if (whiteList.includes(to.path)) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
        }
    }
});

router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    done();
});
