import { createContext, useContext, ReactNode } from 'react';
import { Operator } from '../types';

interface OperatorContextType {
  selectedOperator: Operator | null;
  setSelectedOperator: (operator: Operator | null) => void;
}

export const OperatorContext = createContext<OperatorContextType>({
  selectedOperator: null,
  setSelectedOperator: () => {},
});

export const useOperator = () => useContext(OperatorContext);

interface OperatorProviderProps {
  children: ReactNode;
  value: OperatorContextType;
}

export const OperatorProvider = ({ children, value }: OperatorProviderProps) => {
  return (
    <OperatorContext.Provider value={value}>
      {children}
    </OperatorContext.Provider>
  );
};
