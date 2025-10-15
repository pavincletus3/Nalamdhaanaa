import React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  type: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionContext = React.createContext<{
  openItems: Set<string>;
  toggleItem: (value: string) => void;
}>({
  openItems: new Set(),
  toggleItem: () => {},
});

const Accordion: React.FC<AccordionProps> = ({
  type,
  collapsible = false,
  className = "",
  children,
}) => {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === "single") {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={`w-full ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};
const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  className = "",
  children,
}) => {
  return (
    <div className={`border-b ${className}`} data-value={value}>
      {children}
    </div>
  );
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className = "",
  children,
}) => {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const itemElement = React.useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const item = itemElement.current?.closest("[data-value]");
    const value = item?.getAttribute("data-value");
    if (value) {
      toggleItem(value);
    }
  };

  const item = itemElement.current?.closest("[data-value]");
  const value = item?.getAttribute("data-value");
  const isOpen = value ? openItems.has(value) : false;

  return (
    <button
      ref={itemElement}
      className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline ${className}`}
      onClick={handleClick}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  className = "",
  children,
}) => {
  const { openItems } = React.useContext(AccordionContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const item = contentRef.current?.closest("[data-value]");
    const value = item?.getAttribute("data-value");
    const isOpen = value ? openItems.has(value) : false;

    if (contentRef.current) {
      contentRef.current.style.display = isOpen ? "block" : "none";
    }
  }, [openItems]);

  return (
    <div
      ref={contentRef}
      className={`overflow-hidden text-sm transition-all ${className}`}
      style={{ display: "none" }}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
