// contexts/PageTitleContext.tsx
import { createContext, useContext, useState } from "react";

type PageContextType = {
  label: string;
  title: string;
  setLabel: (label: string) => void;
  setTitle: (title: string) => void;
};

const PageContext = createContext<PageContextType>({
  label: "",
  title: "",
  setLabel: () => {},
  setTitle: () => {},
});

export function PageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [label, setLabel] = useState("");
  const [title, setTitle] = useState("");

  return (
    <PageContext.Provider value={{ label, title, setLabel, setTitle }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
