-- Créer l'extension uuid-ossp si elle n'existe pas déjà
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Créer la table business_settings
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  address TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  country VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  siret VARCHAR(20),
  tva_number VARCHAR(20),
  default_tva_rate NUMERIC(5,2) NOT NULL DEFAULT 20.0,
  invoice_prefix VARCHAR(20) NOT NULL DEFAULT 'FACT-',
  invoice_next_number INTEGER NOT NULL DEFAULT 1,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  terms_and_conditions TEXT,
  bank_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insérer un enregistrement par défaut s'il n'y en a pas déjà
INSERT INTO business_settings (name, default_tva_rate, invoice_prefix, invoice_next_number)
SELECT 'Mon Entreprise', 20, 'FACT-', 1
WHERE NOT EXISTS (SELECT 1 FROM business_settings LIMIT 1);

-- Ajouter la colonne actif à la table produits s'il n'existe pas déjà
ALTER TABLE produits ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;
