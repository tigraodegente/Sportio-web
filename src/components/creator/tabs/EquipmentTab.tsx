"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { EquipmentProduct, CreatorProfile } from "@/lib/mock/creator-data";

interface EquipmentTabProps {
  products: EquipmentProduct[];
  creator: CreatorProfile;
}

export function EquipmentTab({ products, creator }: EquipmentTabProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">O que eu uso</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="h-full flex flex-col">
              {/* Product image placeholder */}
              <div className="aspect-square bg-slate-100 rounded-xl mb-3 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>

              {/* Product info */}
              <div className="flex-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h4 className="text-sm font-semibold text-slate-900 mt-0.5 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Buy button */}
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3"
              >
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Comprar
                </Button>
              </a>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Affiliate footer note */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
        <Heart className="w-4 h-4 text-red-400" />
        <span>{creator.name} ganha comissao por cada compra</span>
      </div>
    </div>
  );
}
