import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Switch,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { FaAddressCard, FaArrowRight } from "react-icons/fa";
import {
    createChildren,
    getChildrensByUserId,
} from "../../../services/children-service";

export default function ChildrenModal({
    type,
    create,
    id,
    open,
    setOpen,
    handleReload,
}: any) {
    const [loading, setLoading] = useState(false);
    const [paso, setPaso] = useState(1);
    const [formData, setFormData] = useState<SecondStepType>({});
    const [selectedDocumentType, setSelectedDocumentType] = useState<
        string | undefined
    >(undefined);
    const [form1] = useForm();
    const [form2] = useForm();
    const [form3] = useForm();

    const [form] = Form.useForm();

    const [userData, setUserData] = useState([]);

    type FirstStepType = {
        name?: string;
        lastName?: string;
        motherLastName?: string;
        documentType?: string;
        documentNumber?: string;
        birthdate?: string;
        emergencyContactPhone?: string;
        gender?: string;
    };
    type SecondStepType = {
        isStudent?: boolean;
        school?: string;
        grade?: string;
        section?: string;
    };
    type ThirdStepType = {
        isClubMember?: boolean;
        club?: string;
        membershipCardNumber?: string;
        memberName?: string;
        memberLastName?: string;
        memberMotherLastName?: string;
    };

    useEffect(() => {
        getChildrenByIdForm();
    }, []);

    const getChildrenByIdForm = async () => {
        try {
            setLoading(true);
            const children = await getChildrensByUserId();
            form.setFieldsValue(children);
        } catch (error) {
            console.error("Error al obtener datos del hijo:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateChildrenForm = async (values: any) => {
        try {
            setLoading(true);
            // await updateChildren(values, id);
            setOpen(false);
            handleReload();
        } catch (error) {
            console.error("Error al actualizar un hijo:", error);
        } finally {
            setLoading(false);
        }
    };

    const createChildrenForm = async (values: any) => {
        try {
            setLoading(true);
            await createChildren(values);
            setOpen(false);
            form.resetFields();
            form1.resetFields();
            form2.resetFields();
            form3.resetFields();
            setPaso(1);
            handleReload();
        } catch (error) {
            console.error("Error al crear un hijo:", error);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- Funcionalidad de crear
    const onFinishStep1 = (values: any) => {
        console.log(values);
        values.birthdate = values.birthdate.format("YYYY-MM-DD");
        setFormData({
            ...formData,
            ...values,
        });
        console.log(values.birthdate);
        setPaso(paso + 1);
    };

    const onFinishStep2 = (values: any) => {
        setFormData({
            ...formData,
            ...values,
        });
        setPaso(paso + 1);
    };

    const onFinishStep3 = async (values: any) => {
        const finalFormData = {
            ...formData,
            ...values,
        };
        try {
            setLoading(true);
            console.log(finalFormData);
            await createChildrenForm(finalFormData);
            getChildrensByUserId().then((data) => {
                setUserData(data);
            });
            setOpen(false);
        } catch (error) {
            console.error("Error al crear un hijo", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getTitle = (type: string) => {
        switch (type) {
            case "create":
                return "Crear Hijo";
            case "edit":
                return "Editar Hijo";
            case "see":
                return "Ver Hijo";
            default:
                return "Hijo";
        }
    }

    const chooseMethod = (type: string) => {
        switch (type) {
            case "create":
                return createChildrenForm;
            case "edit":
                return updateChildrenForm;
            // case "see":
            //     return seeProductForm;
            default:
                return createChildrenForm;
        }
    }

    return (
        <Modal
            title={getTitle(type)}
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={1000}
            footer={null}
        >
            {/* Formulario 1 */}
            <Form
                name="firstStep"
                onFinish={(values) => {
                    // chooseMethod(type)(values);
                    onFinishStep1(values);
                }}
                onFinishFailed={(error) => {
                    console.log(error);
                }}
                autoComplete="off"
                className="my-10 max-md:mx-20 md:mx-32"
                form={form1}
            >
                <div
                    className={`grid grid-cols-2 gap-x-4 gap-y-2 mb-8 ${
                        paso === 1 ? "block" : "hidden"
                    }`}
                >
                    {/* ------------------Input Nombre Hijo------------------ */}
                    <Form.Item<FirstStepType>
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Por favor, ingresa nombre del hijo.",
                            },
                            {
                                max: 50,
                                message: "El nombre del hijo es muy largo.",
                            },
                        ]}
                        className="col-span-2 cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa nombre del hijo"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Apellido Paterno Hijos------------------ */}
                    <Form.Item<FirstStepType>
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa apellido paterno del hijo.",
                            },
                            {
                                max: 50,
                                message:
                                    "El apellido paterno del hijo es muy largo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa apellido paterno del hijo"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Apellido Materno Hijo------------------ */}
                    <Form.Item<FirstStepType>
                        name="motherLastName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingrese el apellido materno del hijo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa apellido materno del hijo"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Tipo de Documento Hijo------------------ */}
                    <Form.Item<FirstStepType>
                        name="documentType"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingrese tipo de documento del hijo",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Tipo de Documento del Hijo"
                            className="w-full !h-16"
                            // style={{ width: 120 }}
                            size="large"
                            options={[
                                { value: "DNI", label: "DNI" },
                                {
                                    value: "PASSPORT",
                                    label: "Pasaporte",
                                },
                                {
                                    value: "CARNET DE EXTRANJERIA",
                                    label: "Carnet de Extranjería",
                                },
                            ]}
                            onChange={(value) => {
                                setSelectedDocumentType(value);
                                form1.setFieldsValue({
                                    documentNumber: undefined,
                                });
                            }}
                        />
                    </Form.Item>

                    {/* ------------------Input Número de Documento del Hijo------------------ */}
                    <Form.Item<FirstStepType>
                        name="documentNumber"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingrese número de documento del hijo",
                            },
                            {
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject("");
                                    } else if (
                                        selectedDocumentType === "DNI" &&
                                        !/^\d{8}$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            "El DNI debe tener 8 dígitos"
                                        );
                                    } else if (
                                        selectedDocumentType === "PASSPORT" &&
                                        !/^[A-Za-z0-9]{6,10}$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            "El pasaporte debe tener entre 6 y 10 caracteres alfanuméricos"
                                        );
                                    } else if (
                                        selectedDocumentType ===
                                            "CARNET DE EXTRANJERIA" &&
                                        !/^\d{9}$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            "El carné de extranjería debe tener 9 dígitos"
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full border rounded-xl py-5 px-4"
                            placeholder="Número de Documento del Hijo"
                            size="large"
                            prefix={
                                <FaAddressCard className="site-form-item-icon me-1" />
                            }
                            disabled={selectedDocumentType === undefined}
                            maxLength={
                                selectedDocumentType === "DNI"
                                    ? 8
                                    : selectedDocumentType === "PASSPORT"
                                    ? 10
                                    : selectedDocumentType ===
                                      "CARNET DE EXTRANJERIA"
                                    ? 9
                                    : undefined
                            }
                        />
                    </Form.Item>

                    {/* ------------------Input Fecha de Nacimiento del Hijo------------------ */}
                    <Form.Item<FirstStepType>
                        name="birthdate"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingrese fecha de nacimiento del hijo",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <DatePicker
                            className="w-full border rounded-xl p-4"
                            placeholder="Fecha de Nacimiento"
                            size="large"
                            allowClear={false}
                        />
                    </Form.Item>

                    {/* ------------------Input Número de Emergencia------------------ */}
                    <Form.Item<FirstStepType>
                        name="emergencyContactPhone"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingrese su número de emergencia",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <InputNumber
                            className="w-full border rounded-xl py-3 px-4"
                            placeholder="Número de Emergencia"
                            size="large"
                            maxLength={9}
                        />
                    </Form.Item>

                    {/* ------------------Input Sexo del Hijo------------------ */}
                    <Form.Item<FirstStepType>
                        name="gender"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese el sexo del hijo",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Sexo del Hijo"
                            className="w-full !h-16"
                            // style={{ width: 120 }}
                            size="large"
                            options={[
                                {
                                    value: "Masculino",
                                    label: "Masculino",
                                },
                                {
                                    value: "Femenino",
                                    label: "Femenino",
                                },
                            ]}
                            // onChange={(value) => {
                            //   setSelectedDocumentType(value);
                            //   form.setFieldsValue({
                            //     documentNumber: undefined,
                            //   });
                            // }}
                        />
                    </Form.Item>
                </div>
                {/* ------------------Botón de Siguiente------------------ */}
                {paso === 1 && (
                    <Form.Item className="w-full flex justify-center">
                        <button
                            type="submit"
                            className="w-96 bg-[#f46e16] text-white font-semibold rounded-xl p-4 flex justify-center items-center"
                            // bg-blue-500 hover:bg-blue-600
                        >
                            Siguiente
                            <FaArrowRight className="ms-1" />
                        </button>
                    </Form.Item>
                )}
            </Form>

            {/* Formulario 2 */}
            <Form
                name="secondStep"
                onFinish={(values) => {
                    onFinishStep2(values);
                }}
                autoComplete="off"
                className="my-10 max-md:mx-20 md:mx-32"
                form={form2}
            >
                <div
                    className={`grid grid-cols-2 gap-x-4 gap-y-2 mb-8 ${
                        paso === 2 ? "block" : "hidden"
                    }`}
                >
                    {/* ------------------Switch ¿Es estudiante?------------------ */}
                    <Form.Item<SecondStepType> name="isStudent">
                        <Switch className="bg-neutral-400" />
                    </Form.Item>

                    {/* ------------------Input Nombre de la Escuela del Hijo------------------ */}
                    <Form.Item<SecondStepType>
                        name="school"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa nombre de la escuela del hijo.",
                            },
                            {
                                max: 50,
                                message:
                                    "El nombre de la escuela es muy largo.",
                            },
                        ]}
                        className="col-span-2 cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa nombre de la escuela del hijo"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Grado del Hijo------------------ */}
                    <Form.Item<SecondStepType>
                        name="grade"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa el grado del hijo.",
                            },
                            {
                                max: 50,
                                message: "El grado es muy largo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa el grado del hijo"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Sección del Hijo------------------ */}
                    <Form.Item<SecondStepType>
                        name="section"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa la sección del hijo.",
                            },
                            {
                                max: 50,
                                message: "La sección es muy larga.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa la sección del hijo"
                            size="large"
                        />
                    </Form.Item>
                </div>
                {/* ------------------Botón de Siguiente------------------ */}
                {paso === 2 && (
                    <Form.Item className="w-full flex justify-center">
                        <button
                            type="submit"
                            className="w-96 bg-[#f46e16] text-white font-semibold rounded-xl p-4 flex justify-center items-center"
                            // bg-blue-500 hover:bg-blue-600
                        >
                            Siguiente
                            <FaArrowRight className="ms-1" />
                        </button>
                    </Form.Item>
                )}
            </Form>

            {/* Formulario 3 */}
            <Form
                name="thirdStep"
                onFinish={(values) => {
                    onFinishStep3(values);
                    // chooseMethod(type)(values);
                }}
                autoComplete="off"
                className="my-10 max-md:mx-20 md:mx-32"
                form={form3}
            >
                <div
                    className={`grid grid-cols-2 gap-x-4 gap-y-2 mb-8 ${
                        paso === 3 ? "block" : "hidden"
                    }`}
                >
                    {/* ------------------Switch ¿Es miebro de un cub?------------------ */}
                    <Form.Item<ThirdStepType> name="isClubMember">
                        <Switch className="bg-neutral-400" />
                    </Form.Item>

                    {/* ------------------Input Nombre del Club del Miembro------------------ */}
                    <Form.Item<ThirdStepType>
                        name="club"
                        rules={[
                            {
                                required: true,
                                message: "Por favor, ingresa nombre del club.",
                            },
                            {
                                max: 50,
                                message: "El nombre del club es muy largo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa nombre del club"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Número de Carnét de Miembro------------------ */}
                    <Form.Item<ThirdStepType>
                        name="membershipCardNumber"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingrese número del carnét del miembro",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <InputNumber
                            className="w-full border rounded-xl py-3 px-4"
                            placeholder="Número del carnét del miembro"
                            size="large"
                            maxLength={9}
                        />
                    </Form.Item>

                    {/* ------------------Input Nombre del Miembro------------------ */}
                    <Form.Item<ThirdStepType>
                        name="memberName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa nombre del miembro del club.",
                            },
                            {
                                max: 50,
                                message:
                                    "El nombre del miebro del club es muy largo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa nombre del miembro del club"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Apellido Paterno del Miembro------------------ */}
                    <Form.Item<ThirdStepType>
                        name="memberLastName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa apellido paterno del miembro del club.",
                            },
                            {
                                max: 50,
                                message:
                                    "El apellido paterno del miembro del club es muy largo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa apellido paterno del miembro del club"
                            size="large"
                        />
                    </Form.Item>

                    {/* ------------------Input Apellido Materno del Miembro------------------ */}
                    <Form.Item<ThirdStepType>
                        name="memberMotherLastName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor, ingresa apellido materno del miembro del club.",
                            },
                            {
                                max: 50,
                                message:
                                    "El apellido materno del miembro del club es muy largo.",
                            },
                        ]}
                        className="cursor-text"
                    >
                        <Input
                            className="w-full rounded-xl p-4"
                            placeholder="Ingresa apellido materno del miembro del club"
                            size="large"
                        />
                    </Form.Item>
                </div>

                {paso === 3 && (
                    <Form.Item className="w-full flex justify-center">
                        <button
                            type="submit"
                            className="w-96 bg-blue-400 text-white font-semibold rounded-xl p-4 hover:bg-blue-500"
                        >
                            Crear Hijo
                        </button>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
