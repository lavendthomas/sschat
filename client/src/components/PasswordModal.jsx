import {
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Center,
  Input,
  Button,
} from "@chakra-ui/react";

/**
 * This component is responsible for rendering the password modal.
 * This modal is used to enter the password of the user.
 * @param {*} param0
 * @returns The password modal component
 */
export const PasswordModal = ({
  isOpen,
  onClose,
  password,
  setPassword,
  handleSubmit,
  modalBody,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    closeOnOverlayClick={false}
    closeOnEsc={false}
  >
    <ModalOverlay />
    <ModalContent alignContent={"center"}>
      <ModalHeader>Please enter your account password</ModalHeader>
      <ModalBody>{modalBody}</ModalBody>
      <Center>
        <Input
          width={"80%"}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Center>
      <ModalFooter>
        <Button mr={3} onClick={handleSubmit}>
          OK
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
