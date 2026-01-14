-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_project_id_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "project_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_expiry" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
