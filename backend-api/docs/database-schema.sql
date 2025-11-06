-- MaxiCortes Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Materials table - Catalog of available materials
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Wood', 'Metal', 'Glass')),
    width DECIMAL(10,2) NOT NULL CHECK (width > 0),
    height DECIMAL(10,2) NOT NULL CHECK (height > 0),
    thickness DECIMAL(10,2) NOT NULL CHECK (thickness > 0),
    cost_per_unit DECIMAL(10,2) NOT NULL CHECK (cost_per_unit >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Orders table - Customer orders (can contain multiple materials)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID, -- Future: reference to customers table
    customer_name VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Optimized', 'Completed', 'Cancelled')),
    total_cost DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Order items table - Individual pieces within an order
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id),
    geometry_type VARCHAR(20) NOT NULL CHECK (geometry_type IN ('Polygon', 'Circle', 'Oval')),
    geometry_data JSONB NOT NULL, -- Stores coordinates, radius, etc.
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 10),
    label VARCHAR(100), -- Optional label for the piece
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cut optimization results table - Results from optimization engine
CREATE TABLE cut_optimization_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    algorithm_used VARCHAR(50) NOT NULL,
    total_sheets_used INTEGER NOT NULL,
    total_waste_area DECIMAL(12,4) NOT NULL,
    efficiency_percentage DECIMAL(5,2) NOT NULL,
    optimization_time_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cut patterns table - Individual sheet cutting patterns
CREATE TABLE cut_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    optimization_result_id UUID NOT NULL REFERENCES cut_optimization_results(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id),
    sheet_number INTEGER NOT NULL,
    sheet_width DECIMAL(10,2) NOT NULL,
    sheet_height DECIMAL(10,2) NOT NULL,
    used_area DECIMAL(12,4) NOT NULL,
    waste_area DECIMAL(12,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cut pattern pieces table - Pieces placed on each sheet
CREATE TABLE cut_pattern_pieces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cut_pattern_id UUID NOT NULL REFERENCES cut_patterns(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id),
    position_x DECIMAL(10,4) NOT NULL,
    position_y DECIMAL(10,4) NOT NULL,
    rotation_angle DECIMAL(6,2) DEFAULT 0,
    is_flipped BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Waste pieces table - Track waste pieces for potential reuse
CREATE TABLE waste_pieces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cut_pattern_id UUID NOT NULL REFERENCES cut_patterns(id) ON DELETE CASCADE,
    geometry_type VARCHAR(20) NOT NULL CHECK (geometry_type IN ('Polygon', 'Rectangle')),
    geometry_data JSONB NOT NULL,
    area DECIMAL(12,4) NOT NULL,
    is_reusable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Users table - Basic user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Operator' CHECK (role IN ('Admin', 'Manager', 'Operator')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_active ON materials(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_material_id ON order_items(material_id);
CREATE INDEX idx_cut_optimization_results_order_id ON cut_optimization_results(order_id);
CREATE INDEX idx_cut_patterns_optimization_result_id ON cut_patterns(optimization_result_id);
CREATE INDEX idx_cut_patterns_material_id ON cut_patterns(material_id);
CREATE INDEX idx_cut_pattern_pieces_cut_pattern_id ON cut_pattern_pieces(cut_pattern_id);
CREATE INDEX idx_cut_pattern_pieces_order_item_id ON cut_pattern_pieces(order_item_id);
CREATE INDEX idx_waste_pieces_cut_pattern_id ON waste_pieces(cut_pattern_id);
CREATE INDEX idx_waste_pieces_reusable ON waste_pieces(is_reusable);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development
INSERT INTO materials (name, type, width, height, thickness, cost_per_unit, stock_quantity) VALUES
('MDF 18mm Standard', 'Wood', 244.0, 122.0, 1.8, 45.50, 50),
('Plywood Birch 15mm', 'Wood', 250.0, 125.0, 1.5, 65.00, 30),
('Steel Sheet 2mm', 'Metal', 200.0, 100.0, 0.2, 85.00, 25),
('Aluminum Sheet 3mm', 'Metal', 300.0, 150.0, 0.3, 120.00, 20),
('Tempered Glass 6mm', 'Glass', 200.0, 150.0, 0.6, 180.00, 15);

INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@maxicortes.com', '$2a$11$dummy.hash.for.development', 'Admin'),
('operator1', 'operator1@maxicortes.com', '$2a$11$dummy.hash.for.development', 'Operator'),
('manager1', 'manager1@maxicortes.com', '$2a$11$dummy.hash.for.development', 'Manager');

-- Example geometry data formats (JSONB):
-- Polygon: {"type": "polygon", "coordinates": [[x1,y1], [x2,y2], [x3,y3], ...]}
-- Circle: {"type": "circle", "center": [x,y], "radius": r}
-- Oval: {"type": "oval", "center": [x,y], "width": w, "height": h}
-- Rectangle (waste): {"type": "rectangle", "x": x, "y": y, "width": w, "height": h}