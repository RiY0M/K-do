-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "picture" BYTEA,
    "description" TEXT,
    "lastSave" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "users_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "k_dos" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "k_dos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_k_dos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kDoId" TEXT NOT NULL,

    CONSTRAINT "users_k_dos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists_k_dos" (
    "id" TEXT NOT NULL,
    "hasChecked" BOOLEAN NOT NULL DEFAULT true,
    "listId" TEXT NOT NULL,
    "kDoId" TEXT NOT NULL,

    CONSTRAINT "lists_k_dos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "kDoId" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_lists" ADD CONSTRAINT "users_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_lists" ADD CONSTRAINT "users_lists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "k_dos" ADD CONSTRAINT "k_dos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_k_dos" ADD CONSTRAINT "users_k_dos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_k_dos" ADD CONSTRAINT "users_k_dos_kDoId_fkey" FOREIGN KEY ("kDoId") REFERENCES "k_dos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists_k_dos" ADD CONSTRAINT "lists_k_dos_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists_k_dos" ADD CONSTRAINT "lists_k_dos_kDoId_fkey" FOREIGN KEY ("kDoId") REFERENCES "k_dos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_kDoId_fkey" FOREIGN KEY ("kDoId") REFERENCES "k_dos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
