
import { createClient } from '@supabase/supabase-js';

// Configura tu URL y clave de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function calcularSistemaFrances(monto: number, plazo: number, tasa: number) {
    const { data, error } = await supabase
        .rpc('calcular_sistema_frances', {
            monto: monto,
            cant_anios: plazo,
            interes: tasa
        });

    if (error) {
        console.error('Error al calcular el sistema frances:', error);
        throw error;
    }

    return data;
}

export async function calcularSistemaAleman(monto: number, plazo: number, tasa: number) {
    const { data, error } = await supabase
        .rpc('calcular_sistema_aleman', {
            monto: monto,
            cant_anios: plazo,
            interes: tasa
        });

    if (error) {
        console.error('Error al calcular el sistema alemán:', error);
        throw error;
    }

    return data;
}

export async function getConfiguracion(nombre_institucion: string) {
    const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('nombre_institucion', nombre_institucion);

    if (error) {
        console.error('Error al obtener la configuración:', error);
        throw error;
    }

    return data;
}

export async function getConfiguracionPorTipoPrestamos(tipo_prestamo: string) {
    const { data, error } = await supabase
        .rpc('get_configuracion_por_tipo_prestamo', {
            tipo_prestamo: tipo_prestamo
        });

    if (error) {
        console.error('Error al obtener la configuración por tipo de préstamo:', error);
        throw error;
    }

    return data;
}

export async function getTiposPrestamos() {
    const { data, error } = await supabase
        .from('tipo_prestamos')
        .select('*');

    if (error) {
        console.error('Error al obtener los tipos de préstamos:', error);
        throw error;
    }

    return data;
}

