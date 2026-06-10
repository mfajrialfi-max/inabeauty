import { redirect } from "next/navigation";

type AdminProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProductPage({ params }: AdminProductPageProps) {
  const { id } = await params;
  redirect(`/admin/products/${id}/edit`);
}
