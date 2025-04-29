import { Button } from 'antd';
import { useState } from 'react';
import socket from '../services/socketServices';

const SaveChangesButton = () => {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        socket.emit('manual-save', {}, (response: { success: boolean }) => {
            setSaving(false);
            if (response.success) {
                console.log('✅ Cambios guardados manualmente');
            } else {
                console.error('❌ Error al guardar manualmente');
            }
        });
    };

    return (
        <Button loading={saving} type="primary" onClick={handleSave}>
            Guardar avance
        </Button>
    );
};

export default SaveChangesButton;
