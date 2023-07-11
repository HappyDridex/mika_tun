import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTelegram } from "../../hooks/useTelegram";
import useEscapeKey from "../../hooks/useEscapeKey";
import { fromDateToDDMMYYYY } from "../../utils/date-convert";
import BackgroundWrapper from "./BackgroundWrapper";
import InputField from "../ui/InputField";
import ButtonRoundedBig from "../ui/ButtonRoundedBig";
import Datepicker from "../ui/Datepicker";
import ButtonRoundedSmall from "../ui/ButtonRoundedSmall";
import IconCross from "../icons/IconCross";
import { CSSTransition } from "react-transition-group";
import { fieldsAreFilled } from "../../utils/validation";

interface IModalBookTableForm {
    name: string;
    persons: string;
    phone: string;
    date: null | Date;
    time: string;
    comment: string;
}

const ModalBookTable = () => {
    const initialForm: IModalBookTableForm = {
        name: "",
        persons: "",
        phone: "",
        date: null,
        time: "",
        comment: "",
    };

    const [formData, setFormData] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const closeModal = () => navigate(-1);
    const escapeKey = useEscapeKey(closeModal);
    const telegram = useTelegram();
    const { t } = useTranslation();

    const submitIsDisabled = useMemo(() => {
        const formDataEntries = Object.entries(formData);
        if (formDataEntries.some((field) => !field[1] && field[0] !== "comment")) {
            return true;
        } else return false;
    }, [formData]);

    function handleInputText(text: string, key: keyof typeof initialForm) {
        setFormData({ ...formData, [key]: text });
    }

    function handleSelectedDate(date: Date) {
        setFormData({ ...formData, date });
    }

    async function onFormSubmit(evt: React.FormEvent) {
        const { name, persons, phone, time } = formData;
        if (!fieldsAreFilled(name, persons, phone, time) || !formData.date) return;
        evt.preventDefault();
        await telegram.sendForm({
            ...formData,
            date: fromDateToDDMMYYYY(formData.date, "."),
        });
        setFormData(initialForm);
    }

    useEffect(() => {
        setTimeout(() => setShowForm(true), 0);
    }, []);

    return (
        <CSSTransition in={showForm} timeout={200} classNames="from-transparent">
            {() =>
                showForm && (
                    <BackgroundWrapper className="px-[5%] md:px-0">
                        <form
                            className="relative mt-[10vh] h-fit w-full rounded-3xl bg-gray16 px-5 py-[22px] md:w-fit md:px-[180px] md:py-[36px]"
                            onSubmit={onFormSubmit}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="mt-6 text-center text-2xl text-white md:text-3xl">{t("table_reservation")}</h2>
                            <ButtonRoundedSmall onClick={closeModal} className="absolute right-3 top-3 md:right-4 md:top-6">
                                <IconCross />
                            </ButtonRoundedSmall>
                            <div className="mt-[30px] flex flex-col md:mt-[47px]">
                                <InputField onInput={(text) => handleInputText(text, "name")} placeholder={t("your_name")} />
                                <InputField
                                    onInput={(text) => handleInputText(text, "phone")}
                                    value={formData.phone}
                                    onlyNumbers
                                    inputMask="+"
                                    placeholder={t("phone_number")}
                                    className="mt-[18px] md:mt-[26px]"
                                />
                                <InputField
                                    onInput={(text) => handleInputText(text, "persons")}
                                    value={formData.persons}
                                    onlyNumbers
                                    placeholder={t("persons_amount")}
                                    className="mt-[18px] md:mt-[26px]"
                                />
                                <Datepicker
                                    onDateChange={handleSelectedDate}
                                    onTimeChange={(text) => handleInputText(text, "time")}
                                    selectedDate={formData.date}
                                    time={formData.time}
                                    className="mt-[18px] md:mt-[26px]"
                                />
                                <InputField
                                    onInput={(text) => handleInputText(text, "comment")}
                                    placeholder={t("comment")}
                                    className="mt-[18px] md:mt-[26px]"
                                />
                            </div>
                            <ButtonRoundedBig
                                className="mx-auto mt-[31px] block"
                                title={t("send")}
                                color={"white"}
                                isDisabled={submitIsDisabled}
                                type="submit"
                            />
                        </form>
                    </BackgroundWrapper>
                )
            }
        </CSSTransition>
    );
};

export default ModalBookTable;