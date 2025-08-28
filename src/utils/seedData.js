import { tecnicosApi, clientesApi, ticketsApi } from '../services/api';

export const seedInitialData = async () => {
  try {
    console.log('🌱 Iniciando población de datos...');

    // Crear técnicos
    const tecnicos = [
      {
        nombre: 'Juan Pérez',
        email: 'juan@empresa.com',
        especialidad: 'Hardware',
        telefono: '555-0101'
      },
      {
        nombre: 'María González',
        email: 'maria@empresa.com',
        especialidad: 'Software',
        telefono: '555-0102'
      },
      {
        nombre: 'Carlos Rodríguez',
        email: 'carlos@empresa.com',
        especialidad: 'Redes',
        telefono: '555-0103'
      }
    ];

    console.log('📋 Creando técnicos...');
    const createdTecnicos = [];
    for (const tecnico of tecnicos) {
      const created = await tecnicosApi.create(tecnico);
      createdTecnicos.push(created);
      console.log(`✅ Técnico creado: ${tecnico.nombre}`);
    }

    // Crear clientes
    const clientes = [
      {
        nombre: 'Empresa ABC',
        contacto: 'Ana López',
        email: 'ana@abc.com',
        telefono: '555-0201',
        direccion: 'Av. Principal 123'
      },
      {
        nombre: 'Corporación XYZ',
        contacto: 'Luis Martín',
        email: 'luis@xyz.com',
        telefono: '555-0202',
        direccion: 'Calle Secundaria 456'
      },
      {
        nombre: 'Industrias DEF',
        contacto: 'Carmen Silva',
        email: 'carmen@def.com',
        telefono: '555-0203',
        direccion: 'Blvd. Comercial 789'
      }
    ];

    console.log('🏢 Creando clientes...');
    const createdClientes = [];
    for (const cliente of clientes) {
      const created = await clientesApi.create(cliente);
      createdClientes.push(created);
      console.log(`✅ Cliente creado: ${cliente.nombre}`);
    }

    // Crear tickets
    const tickets = [
      {
        titulo: 'Problema con impresora',
        descripcion: 'La impresora no responde después de la actualización del driver',
        prioridad: 'Media',
        estado: 'Abierto',
        clienteId: createdClientes[0].id,
        tecnicoId: createdTecnicos[0].id,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        titulo: 'Sistema lento',
        descripcion: 'El sistema de gestión presenta lentitud desde esta mañana',
        prioridad: 'Alta',
        estado: 'En progreso',
        clienteId: createdClientes[1].id,
        tecnicoId: createdTecnicos[1].id,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        titulo: 'Conectividad de red',
        descripcion: 'Intermitencia en la conexión a internet en el área de contabilidad',
        prioridad: 'Baja',
        estado: 'Cerrado',
        clienteId: createdClientes[2].id,
        tecnicoId: createdTecnicos[2].id,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }
    ];

    console.log('🎫 Creando tickets...');
    for (const ticket of tickets) {
      const created = await ticketsApi.create(ticket);
      console.log(`✅ Ticket creado: ${ticket.titulo}`);
    }

    console.log('🎉 ¡Datos iniciales creados exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error al poblar datos:', error);
    return false;
  }
};
