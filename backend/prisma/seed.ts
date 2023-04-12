import { PrismaClient } from '@prisma/client'
import * as dayjs from 'dayjs'
const prisma = new PrismaClient()

class UpsertIdCtr {
  constructor() { this.ctr = 0}

  ctr: number;
  next = () => ++this.ctr;
  reset = () => { this.ctr = 0; }
}


async function main() {

  const ctr = new UpsertIdCtr();



  const status_pending = await prisma.status.upsert({
    where: { id: 1 },
    update: {},
    create: {
        id: 1,
        name: 'Pending',
        isActive: true
  }})
  const status_completed = await prisma.status.upsert({
    where: { id: 2 },
    update: {},
    create: {
        id: 2,
        name: 'Completed',
        isActive: false
  }})
  const status_cancelled = await prisma.status.upsert({
    where: { id: 3 },
    update: {},
    create: {
        id: 3,
        name: 'Cancelled',
        isActive: false
  }})
  const status_rejected = await prisma.status.upsert({
    where: { id: 4 },
    update: {},
    create: {
        id: 4,
        name: 'Rejected',
        isActive: false
  }})


  await prisma.person.upsert({
      where: { id: 1 },
      update: {},
      create: {
          id: 1,
          name: 'Adam One',
          code: 'M-0001'
    }})
  await prisma.person.upsert({
    where: { id: 2 },
    update: {},
    create: {
        id: 2,
        name: 'Hawwa Two',
        code: 'M-0002'
  }})
  await prisma.person.upsert({
    where: { id: 3 },
    update: {},
    create: {
        id: 3,
        name: 'Ibrahim Three',
        code: 'M-0003'
  }})
  await prisma.person.upsert({
    where: { id: 4 },
    update: {},
    create: {
        id: 4,
        name: 'Hajar Four',
        code: 'M-0004'
  }})
  await prisma.person.upsert({
    where: { id: 5 },
    update: {},
    create: {
        id: 5,
        name: 'Ismail Five',
        code: 'M-0005'
  }})
  await prisma.person.upsert({
    where: { id: 6 },
    update: {},
    create: {
        id: 6,
        name: 'Aminath Six',
        code: 'M-0006'
  }})
  await prisma.person.upsert({
    where: { id: 7 },
    update: {},
    create: {
        id: 7,
        name: 'Mohamed Seven',
        code: 'M-0007'
  }})




  ctr.reset()
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {
      name: 'Male City',
      coordinateX: 4.17521,
      coordinateY: 73.50916,
      isDeleted: false,
      createdById: 1,
      modifiedById: 1
    },
    create: {
        name: 'Male City',
        coordinateX: 4.17521,
        coordinateY: 73.50916,
        isDeleted: false,
        createdById: 1,
        modifiedById: 1
    }
  })
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'Hulhumale',
        coordinateX: 4.2167,
        coordinateY: 73.5333,
        isDeleted: false
  }})
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'Thinadhoo City',
        coordinateX: 0.53333,
        coordinateY: 72.93333,
        isDeleted: false
  }})
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'Fuvahmulah City',
        coordinateX: -0.29878,
        coordinateY: 73.42403,
        isDeleted: false
  }})
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'MTCC Head Office OLD',
        coordinateX: 4.178184039347687,
        coordinateY: 73.51541393356229,
        isDeleted: true
  }})
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'MTCC Head Office',
        coordinateX: 4.178184039347687,
        coordinateY: 73.51541393356229,
        isDeleted: false
  }})
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'Hulhumale Central Park',
        coordinateX: 4.216829692790098,
        coordinateY: 73.54028378428993,
        isDeleted: false
  }})
  await prisma.location.upsert({
    where: { id: ctr.next() },
    update: {},
    create: {
        name: 'Mt Phase 2',
        coordinateX: 4.240669176561842,
        coordinateY: 73.54505429579758,
        isDeleted: false
  }})
  
    
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })