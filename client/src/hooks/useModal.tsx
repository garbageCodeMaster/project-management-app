import { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  modalContent: number | undefined;
  openModal: (id?: number | undefined) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const ModalProvider = ({ children }: React.PropsWithChildren) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<number>();

  const openModal = (id?: number) => {
    setModalContent(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(undefined);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  return context;
};
