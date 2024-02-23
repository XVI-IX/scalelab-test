-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('customer', 'superadmin', 'vendor');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'processing', 'confirmed', 'delivered', 'canceled');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'failed', 'successful');

-- CreateEnum
CREATE TYPE "genericStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "password" TEXT,
    "google_id" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'customer',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "verificationToken" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "recipient_code" TEXT,
    "status" "genericStatus" NOT NULL DEFAULT 'pending',
    "resetToken" TEXT,
    "role" TEXT NOT NULL DEFAULT 'vendor',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "status" "genericStatus" NOT NULL DEFAULT 'pending',
    "admin_open" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "timeslot_id" INTEGER NOT NULL,
    "placed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_location" TEXT NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'pending',
    "total_price" DOUBLE PRECISION NOT NULL,
    "vendor_id" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeslots" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "timeslots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_phone_number_key" ON "vendors"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_verificationToken_key" ON "vendors"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_timeslot_id_fkey" FOREIGN KEY ("timeslot_id") REFERENCES "timeslots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
