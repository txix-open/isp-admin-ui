import {Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
import {Button} from "antd";
import CloseBtn from "@components/CloseBtn";
import './modal.scss';

interface ModalPropsType {
    onOk?:  () => void
    title: string
    children: ReactNode
    setIsOpenModal: Dispatch<SetStateAction<boolean>>
    footer?: {onOkText: string, onCanselText: string}
}

const Modal = ({ onOk, footer,  title, children,  setIsOpenModal }: ModalPropsType) => {
    const closeModal = () => {
        setIsOpenModal(false);
    };

    const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return (
        <section className="modal" onClick={closeModal}>
            <div className="modal__wrap" onClick={handleModalClick}>
                <h1 className="modal__title">{title}</h1>
                <div className="modal__content">
                    {children}
                </div>
                {footer &&
                    <div className="modal__footer">
                        <Button type="default" onClick={closeModal}>{footer.onCanselText}</Button>
                        <Button type="default" onClick={onOk}>{footer.onOkText}</Button>
                    </div>
                }
                <CloseBtn onClick={closeModal} ariaLabel="close"/>
            </div>

        </section>
    );
};

export default Modal;