import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { Fee } from "../../types";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

const IuranList: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const feesData = await userService.getFees();
      setFees(feesData);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "lunas":
        return "default"; // hijau (bisa override via tailwind)
      case "pending":
        return "secondary"; // abu / kuning
      case "belum bayar":
        return "destructive"; // merah
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden ">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full "></div>

        <div className="relative p-6">
          <h1 className="text-2xl font-bold mb-1">Daftar Iuran</h1>
          <p className="text-green-100 text-sm">
            Kelola pembayaran iuran RT/RW Anda
          </p>
        </div>
      </div>

      <div className="p-6">
        {fees.length > 0 ? (
          <div className="space-y-4">
            {fees.map((fee) => (
              <Card key={fee.id} className="shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{fee.kategori}</CardTitle>
                    <CardDescription>Bulan: {fee.bulan}</CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(fee.status)}>
                    {fee.status}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    Rp {fee.nominal.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jatuh tempo: {formatDate(fee.due_date)}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/iuran/${fee.id}`)}>
                    {fee.status === "Belum Bayar"
                      ? "Bayar Sekarang"
                      : "Lihat Detail"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">Belum Ada Iuran</p>
            <p className="text-muted-foreground">
              Iuran akan muncul setelah admin membuatnya
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IuranList;
