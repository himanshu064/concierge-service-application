import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { App as AntdApp } from "antd";
import {
  AuthPage,
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "@/pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "@/pages/categories";

import { Refine, Authenticated } from "@refinedev/core";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { supabaseClient } from "@/lib/supbaseClient";
import authProvider from "@/lib/authProvider";
import { AppIcon, Header } from "@/components";
import ENV from "./env";
// import { useEffect } from "react";
// import { addData } from "./supabase/addData";
import { ClientList } from "./pages/clients/list";
import { ClientCreate } from "./pages/clients/create";
import { ClientEditPage } from "./pages/clients/edit";

import "react-phone-input-2/lib/style.css";
import { TeamOutlined } from "@ant-design/icons";
import { RegisterPage } from "./components/RegisterPage";

function App() {
  // useEffect(() => {
  //   addData();
  // }, []);

  return (
    <BrowserRouter>
      <AntdApp>
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          liveProvider={liveProvider(supabaseClient)}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          routerProvider={routerBindings}
          resources={[
            {
              name: "blog_posts",
              list: "/blog-posts",
              create: "/blog-posts/create",
              edit: "/blog-posts/edit/:id",
              show: "/blog-posts/show/:id",
              meta: {
                canDelete: true,
              },
            },
            {
              name: "categories",
              list: "/categories",
              create: "/categories/create",
              edit: "/categories/edit/:id",
              show: "/categories/show/:id",
              meta: {
                canDelete: true,
              },
            },
            {
              name: "clients",
              list: "/clients",
              create: "/clients/create",
              edit: "/clients/edit/:id",
              meta: {
                canDelete: true,
                icon: <TeamOutlined />,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: ENV.SUPABASE_PROJECT_ID,
            title: { text: "Concierge Service Application", icon: <AppIcon /> },
          }}
        >
          {/* Routes */}
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayoutV2
                    Header={Header}
                    Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route
                index
                element={<NavigateToResource resource="blog_posts" />}
              />
              <Route path="/blog-posts">
                <Route index element={<BlogPostList />} />
                <Route path="create" element={<BlogPostCreate />} />
                <Route path="edit/:id" element={<BlogPostEdit />} />
                <Route path="show/:id" element={<BlogPostShow />} />
              </Route>
              <Route path="/categories">
                <Route index element={<CategoryList />} />
                <Route path="create" element={<CategoryCreate />} />
                <Route path="edit/:id" element={<CategoryEdit />} />
                <Route path="show/:id" element={<CategoryShow />} />
              </Route>
              <Route path="/clients">
                <Route index element={<ClientList />} />
                <Route path="create" element={<ClientCreate />} />
                <Route path="edit/:id" element={<ClientEditPage />} />
              </Route>
              <Route path="*" element={<ErrorComponent />} />
            </Route>
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route
                path="/login"
                element={
                  <AuthPage
                    type="login"
                    formProps={{
                      initialValues: {
                        email: "",
                        password: "",
                      },
                    }}
                  />
                }
              />
              <Route
                path="/register"
                element={
                 <RegisterPage/>
                }
              />
              <Route
                path="/forgot-password"
                element={<AuthPage type="forgotPassword" />}
              />
            </Route>
          </Routes>

          {/* Utilities */}
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
