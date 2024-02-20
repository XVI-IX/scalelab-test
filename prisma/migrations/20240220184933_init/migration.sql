-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('customer', 'superadmin', 'vendor');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'processing', 'delivered', 'canceled');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'failed', 'successful');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "vendor_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("vendor_id")
);

-- CreateTable
CREATE TABLE "stores" (
    "store_id" TEXT NOT NULL,
    "vendor_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" TEXT NOT NULL,
    "customer_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "timeslot_id" TEXT NOT NULL,
    "placed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "order_status" NOT NULL DEFAULT 'pending',
    "total_price" DOUBLE PRECISION NOT NULL,
    "payment_status" "payment_status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "timeslots" (
    "timeslot_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeslots_pkey" PRIMARY KEY ("timeslot_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_phone_number_key" ON "vendors"("phone_number");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("vendor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("vendor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
