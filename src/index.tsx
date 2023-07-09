import "@fontsource-variable/inter";

import React from "react";
import ReactDOM from "react-dom/client";
import {ChakraProvider, ColorModeScript, Spinner, extendTheme} from "@chakra-ui/react";

import EtherProviderContextProvider, {
  useEtherProvider
} from "./connection/EtherProviderContext";
import {QueryClient, QueryClientProvider} from "react-query";

import {RouterProvider, createBrowserRouter} from "react-router-dom";
import ProjectDetailPage from "./project/detail/ProjectDetailPage";
import {CATEGORIES, PROJECTS} from "./project/projectTypes";
import HomePage from "./home/HomePage";
import MyAccountPage from "./my-account/MyAccountPage";
import CategoryDetailPage from "./category/CategoryDetailPage";
import SafeTest from "./safe/SafeTest";

// Temporary fix for BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  },
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Inter Variable', sans-serif`
  }
});

// Create a client
const queryClient = new QueryClient();

export default function App() {
  const {providerState} = useEtherProvider();
  const isAccountLoading =
    providerState.status === "loading" ||
    (providerState.status === "connected" && !providerState.accountReady);

  if (isAccountLoading) return <Spinner />;

  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },

  {
    path: "/projects/:projectId",
    loader: ({params}) => ({
      project: PROJECTS.find((p) => p.id === params.projectId)
    }),
    element: <ProjectDetailPage />
  },

  {
    path: "/my-account/",
    loader: () => ({}),
    element: <MyAccountPage />
  },
  {
    path: "/categories/:categoryId",
    loader: ({params}) => ({
      category: CATEGORIES.find((p) => p.id === params.categoryId)
    }),
    element: <CategoryDetailPage />
  },
  {
    path: "/safe",
    element: <SafeTest />
  }
]);

root.render(
  <React.StrictMode>
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: "bottom-right",
          isClosable: true,
          duration: 5000
        }
      }}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <EtherProviderContextProvider>
          <App />
        </EtherProviderContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
