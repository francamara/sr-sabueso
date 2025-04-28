import { prisma } from "@/lib/prisma";
import { MovementTypeEnum } from "@/types/movementType";



type AdjustStockParams = {
  productId: number;
  userId: number;
  movementType: MovementTypeEnum;  // ← enum, no número suelto
  change: number;
  referenceId?: number;
};

export async function adjustStock({
  productId,
  userId,
  movementType,
  change,
  referenceId,
}: AdjustStockParams) {
  return prisma.$transaction(async (tx) => {
    // 1) Verificar stock suficiente si la baja es negativa
    if (change < 0) {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { stock: true },
      });
      if (!product || product.stock + change < 0) {
        throw new Error("Stock insuficiente");
      }
    }

    // 2) Registrar movimiento
    await tx.stockMovement.create({
      data: {
        product_id: productId,
        user_id: userId,
        movement_type_id: movementType,
        change,
        reference_id: referenceId ?? 0,
      },
    });

    // 3) Actualizar stock del producto
    return tx.product.update({
      where: { id: productId },
      data: { stock: { increment: change } },
    });
  });
}
