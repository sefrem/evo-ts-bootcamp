import React from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};
