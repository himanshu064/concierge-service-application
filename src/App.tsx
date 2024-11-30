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
import { IdcardOutlined, TeamOutlined } from "@ant-design/icons";
import { RegisterPage } from "./components/RegisterPage";
import { InvitationList } from "./pages/clientInvites/list";

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
              name: "clients",
              list: "/clients",
              create: "/clients/create",
              edit: "/clients/edit/:id",
              meta: {
                canDelete: true,
                icon: <TeamOutlined />,
              },
            },
            {
              name: "invites",
              list: "/invitations",
              meta:{
                canDelete: true,
                icon: <IdcardOutlined />,
              }
            }
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
                element={<NavigateToResource resource="clients" />}
              />
              <Route path="/clients">
                <Route index element={<ClientList />} />
                <Route path="create" element={<ClientCreate />} />
                <Route path="edit/:id" element={<ClientEditPage />} />
              </Route>
              <Route path="/invitations">
              <Route index element={<InvitationList />} />
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
                  <div className="login-container">
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: "",
                          password: "",
                        },
                      }}
                    />
                  </div>
                }
              />
              <Route path="/register" element={<RegisterPage />} />
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
