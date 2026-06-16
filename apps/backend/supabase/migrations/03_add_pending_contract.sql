-- Añadir el nuevo estado 'pending_contract' al enum 'application_status'
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'pending_contract';
