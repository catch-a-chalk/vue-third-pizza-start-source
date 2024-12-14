import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { middlewarePipeline } from "@/middlewares/middlewarePipeline";

export const router = createRouter({
  routes,
  history: createWebHistory(),
});

middlewarePipeline(router);