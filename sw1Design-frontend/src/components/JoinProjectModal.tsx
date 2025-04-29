import { Form, Input, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socketServices';

interface JoinProjectModalProps {
    visible: boolean;
    onCancel: () => void;
}

const JoinProjectModal = ({ visible, onCancel }: JoinProjectModalProps) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleOk = () => {
        form
            .validateFields()
            .then(values => {
                const { projectId, secretKey } = values;

                socket.emit('join-project', projectId, secretKey || '', (response: any) => {
                    if (response.error) {
                        message.error(response.error);
                        return;
                    }

                    const url = secretKey
                        ? `/canvas?projectId=${projectId}&key=${secretKey}`
                        : `/canvas?projectId=${projectId}`;

                    navigate(url, {
                        state: {
                            elements: response.elements,
                            isEditor: response.isEditor
                        }
                    });
                    onCancel();
                    form.resetFields();
                });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Unirse a proyecto existente"
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Unirse"
            cancelText="Cancelar"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ projectId: '', secretKey: '' }}
            >
                <Form.Item
                    name="projectId"
                    label="ID del Proyecto"
                    rules={[{ required: true, message: 'Por favor ingresa el ID del proyecto' }]}
                >
                    <Input placeholder="Ej: DrqlaOXdb5XY" />
                </Form.Item>

                <Form.Item
                    name="secretKey"
                    label="Clave de modificación (opcional)"
                    help="Solo necesaria si quieres editar el proyecto"
                >
                    <Input placeholder="Ej: ynUmB_tSIcHiHJ6EdlmkVmagwr1PkNgi" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default JoinProjectModal;