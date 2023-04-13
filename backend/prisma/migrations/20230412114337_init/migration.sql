-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "belongsToEntityType" TEXT,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coordinateX" DECIMAL,
    "coordinateY" DECIMAL,
    "addressDetails" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "modifiedById" INTEGER,
    "modifiedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "tripRequestId" INTEGER,
    "fromLocationId" INTEGER NOT NULL,
    "toLocationId" INTEGER NOT NULL,
    "departureTime" TIMESTAMP(6) NOT NULL,
    "arrivalTime" TIMESTAMP(6) NOT NULL,
    "peopleCapacity" INTEGER NOT NULL DEFAULT 0,
    "cargoWeightCapacity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peopleCapacityRemaining" INTEGER NOT NULL DEFAULT 0,
    "cargoWeightCapacityRemaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statusId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedById" INTEGER NOT NULL,
    "modifiedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripTicket" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "dependentTicketId" INTEGER,
    "personId" INTEGER,
    "cargoId" INTEGER,
    "remarks" TEXT,
    "statusId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedById" INTEGER NOT NULL,
    "modifiedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "cargoWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripRequest" (
    "id" SERIAL NOT NULL,
    "fromLocationId" INTEGER NOT NULL,
    "toLocationId" INTEGER NOT NULL,
    "departEarliest" TIMESTAMP(6),
    "departLatest" TIMESTAMP(6),
    "arriveEarliest" TIMESTAMP(6),
    "arriveLatest" TIMESTAMP(6),
    "remarks" TEXT,
    "statusId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedById" INTEGER NOT NULL,
    "modifiedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PersonToTripRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CargoToTripRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToTripRequest_AB_unique" ON "_PersonToTripRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToTripRequest_B_index" ON "_PersonToTripRequest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CargoToTripRequest_AB_unique" ON "_CargoToTripRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_CargoToTripRequest_B_index" ON "_CargoToTripRequest"("B");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripTicket" ADD CONSTRAINT "TripTicket_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripTicket" ADD CONSTRAINT "TripTicket_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripTicket" ADD CONSTRAINT "TripTicket_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripTicket" ADD CONSTRAINT "TripTicket_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripRequest" ADD CONSTRAINT "TripRequest_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripRequest" ADD CONSTRAINT "TripRequest_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TripRequest" ADD CONSTRAINT "TripRequest_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_PersonToTripRequest" ADD CONSTRAINT "_PersonToTripRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToTripRequest" ADD CONSTRAINT "_PersonToTripRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "TripRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CargoToTripRequest" ADD CONSTRAINT "_CargoToTripRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Cargo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CargoToTripRequest" ADD CONSTRAINT "_CargoToTripRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "TripRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
