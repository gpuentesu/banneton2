DO $$
DECLARE
	v_id_receta_padre INT;
	v_id_harina INT;
	v_id_leche INT;
	v_id_yogurt INT;
	v_id_azucar INT;
	v_id_sal INT;
	v_id_levadura INT;
	v_id_mantequilla INT;
BEGIN
	-- 1. ARREGLAR LA SECUENCIA: Forzamos al contador a ir un número arriba del ID máximo real actual
	PERFORM setval(pg_get_serial_sequence('catalogo_componente', 'id_componente'), COALESCE(MAX(id_componente), 0) + 1) FROM catalogo_componente;

	-- 2. Insertar la Receta Padre en el catálogo general
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Masa Base Panadera', 'RECETA', 'G', true)
	RETURNING id_componente INTO v_id_receta_padre;

	-- 3. Registrar la extensión en receta_subreceta
	INSERT INTO receta_subreceta (id_componente, ppu_objetivo, unidades_tanda, porcentaje_merma_coccion, creado_en)
	VALUES (v_id_receta_padre, NULL, 1, 0.00, NOW());

	-- =================================================================
	-- 4. INSERTAR COMPONENTES HIJOS Y ENLAZARLOS EN LA FORMULACIÓN
	-- =================================================================

	-- --- HARINA DE TRIGO ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Harina de trigo', 'INGREDIENTE', 'G', true)
	RETURNING id_componente INTO v_id_harina;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_harina, true);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_harina, 109.3000, 'G', 'Harina base formulada.');


	-- --- LECHE ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Leche', 'INGREDIENTE', 'mililitros', true)
	RETURNING id_componente INTO v_id_leche;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_leche, false);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_leche, 54.6000, 'mililitros', 'Líquido de hidratación.');


	-- --- YOGURT GRIEGO ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Yogurt griego', 'INGREDIENTE', 'G', true)
	RETURNING id_componente INTO v_id_yogurt;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_yogurt, false);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_yogurt, 10.9000, 'G', 'Aporte graso y lácteo.');


	-- --- AZÚCAR ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Azúcar', 'INGREDIENTE', 'G', true)
	RETURNING id_componente INTO v_id_azucar;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_azucar, false);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_azucar, 8.7000, 'G', 'Endulzante.');


	-- --- SAL ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Sal', 'INGREDIENTE', 'G', true)
	RETURNING id_componente INTO v_id_sal;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_sal, false);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_sal, 2.2000, 'G', 'Potenciador de sabor.');


	-- --- LEVADURA ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Levadura', 'INGREDIENTE', 'G', true)
	RETURNING id_componente INTO v_id_levadura;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_levadura, false);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_levadura, 3.3000, 'G', 'Agente leudante.');


	-- --- MANTEQUILLA ---
	INSERT INTO catalogo_componente (nombre, tipo_componente, unidad_medida, activo)
	VALUES ('Mantequilla', 'INGREDIENTE', 'G', true)
	RETURNING id_componente INTO v_id_mantequilla;

	INSERT INTO ingrediente_base (id_componente, aporta_a_base_panadera)
	VALUES (v_id_mantequilla, false);

	INSERT INTO detalle_formulacion (id_receta_padre, id_componente_hijo, cantidad_usada, unidad_medida_usada, nota_preparacion)
	VALUES (v_id_receta_padre, v_id_mantequilla, 10.9000, 'G', 'Materia grasa final.');

	RAISE NOTICE 'Secuencia corregida y receta insertada de manera exitosa.';
END $$;