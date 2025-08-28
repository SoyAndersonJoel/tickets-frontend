import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { tecnicosService, clientesService, ticketsService } from '../firebase/services';

// Función para limpiar una colección
const clearCollection = async (collectionName) => {
  try {
    console.log(`🗑️ Limpiando colección: ${collectionName}`);
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    const deletePromises = querySnapshot.docs.map(document => 
      deleteDoc(doc(db, collectionName, document.id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Colección ${collectionName} limpiada (${querySnapshot.docs.length} documentos eliminados)`);
  } catch (error) {
    console.error(`❌ Error limpiando ${collectionName}:`, error);
  }
};

// Función para poblar datos iniciales
export const clearAndSeedData = async () => {
  try {
    console.log('🚀 Iniciando limpieza y población de datos...');

    // 1. Limpiar todas las colecciones
    await clearCollection('tickets');
    await clearCollection('clientes');
    await clearCollection('tecnicos');

    // 2. Crear técnicos
    console.log('👨‍🔧 Creando técnicos...');
    const tecnicos = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '12345678',
        fecha_nacimiento: '1990-05-15',
        genero: 'Masculino',
        ciudad: 'Bogotá',
        direccion: 'Calle 123 #45-67',
        telefono: '555-0101',
        email: 'juan.perez@empresa.com'
      },
      {
        nombre: 'María',
        apellido: 'González',
        cedula: '87654321',
        fecha_nacimiento: '1985-08-22',
        genero: 'Femenino',
        ciudad: 'Medellín',
        direccion: 'Carrera 45 #23-89',
        telefono: '555-0102',
        email: 'maria.gonzalez@empresa.com'
      },
      {
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        cedula: '11223344',
        fecha_nacimiento: '1992-03-10',
        genero: 'Masculino',
        ciudad: 'Cali',
        direccion: 'Avenida 78 #12-34',
        telefono: '555-0103',
        email: 'carlos.rodriguez@empresa.com'
      }
    ];

    const createdTecnicos = [];
    for (const tecnico of tecnicos) {
      const created = await tecnicosService.create(tecnico);
      createdTecnicos.push(created);
      console.log(`✅ Técnico creado: ${tecnico.nombre} ${tecnico.apellido} (ID: ${created.id})`);
    }

    // 3. Crear clientes
    console.log('🏢 Creando clientes...');
    const clientes = [
      {
        cedula: '98765432',
        nombre: 'Ana',
        apellido: 'López',
        ciudad: 'Bogotá',
        email: 'ana.lopez@abc.com',
        direccion: 'Av. Principal 123',
        telefono: '555-0201',
        fecha_nacimiento: '1988-12-05',
        dependencia: 'Sistemas'
      },
      {
        cedula: '56789012',
        nombre: 'Luis',
        apellido: 'Martín',
        ciudad: 'Medellín',
        email: 'luis.martin@xyz.com',
        direccion: 'Calle Secundaria 456',
        telefono: '555-0202',
        fecha_nacimiento: '1975-07-18',
        dependencia: 'Administración'
      },
      {
        cedula: '34567890',
        nombre: 'Carmen',
        apellido: 'Silva',
        ciudad: 'Cali',
        email: 'carmen.silva@def.com',
        direccion: 'Blvd. Comercial 789',
        telefono: '555-0203',
        fecha_nacimiento: '1983-09-25',
        dependencia: 'Contabilidad'
      }
    ];

    const createdClientes = [];
    for (const cliente of clientes) {
      const created = await clientesService.create(cliente);
      createdClientes.push(created);
      console.log(`✅ Cliente creado: ${cliente.nombre} ${cliente.apellido} (ID: ${created.id})`);
    }

    // 4. Crear tickets
    console.log('🎫 Creando tickets...');
    const tickets = [
      {
        codigo: 'TKT-001',
        descripcion: 'Problema con impresora HP LaserJet no responde después de la actualización del driver',
        id_tecnico: createdTecnicos[0].id,
        id_cliente: createdClientes[0].id
      },
      {
        codigo: 'TKT-002',
        descripcion: 'Sistema de gestión presenta lentitud extrema desde esta mañana, usuarios no pueden trabajar',
        id_tecnico: createdTecnicos[1].id,
        id_cliente: createdClientes[1].id
      },
      {
        codigo: 'TKT-003',
        descripcion: 'Intermitencia en la conexión a internet en el área de contabilidad, afecta el trabajo remoto',
        id_tecnico: createdTecnicos[2].id,
        id_cliente: createdClientes[2].id
      }
    ];

    for (const ticket of tickets) {
      const created = await ticketsService.create(ticket);
      console.log(`✅ Ticket creado: ${ticket.codigo} (ID: ${created.id})`);
    }

    console.log('🎉 ¡Base de datos limpiada y poblada exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${createdTecnicos.length} técnicos creados`);
    console.log(`   - ${createdClientes.length} clientes creados`);
    console.log(`   - ${tickets.length} tickets creados`);

    return {
      success: true,
      data: {
        tecnicos: createdTecnicos,
        clientes: createdClientes,
        tickets: tickets.length
      }
    };

  } catch (error) {
    console.error('❌ Error en limpieza y población:', error);
    return { success: false, error: error.message };
  }
};
