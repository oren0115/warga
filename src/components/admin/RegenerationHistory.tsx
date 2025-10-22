import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ConfirmationDialog from "../ui/confirmation-dialog";
import Toast from "../ui/toast";
import { useToast } from "../../hooks/useToast";
import { 
  History, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw
} from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { RegenerationHistory as RegenerationHistoryType } from "../../types";
import { formatDateTimeWithPukul } from "../../utils/format.utils";

interface RegenerationHistoryProps {
  className?: string;
}

const RegenerationHistory: React.FC<RegenerationHistoryProps> = ({ className = "" }) => {
  const [history, setHistory] = useState<RegenerationHistoryType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRollbackDialog, setShowRollbackDialog] = useState(false);
  const [rollbackMonth, setRollbackMonth] = useState<string>("");
  const [isRollingBack, setIsRollingBack] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Generate available months (last 12 months)
  const generateAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      months.push({ value: monthValue, label: monthLabel });
    }
    
    return months;
  };

  const fetchHistory = async (bulan: string) => {
    if (!bulan) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await adminService.getRegenerationHistory(bulan);
      setHistory(data);
    } catch (err: any) {
      console.error("Error fetching regeneration history:", err);
      setError(err.message || "Gagal memuat history regenerasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = (bulan: string) => {
    setRollbackMonth(bulan);
    setShowRollbackDialog(true);
  };

  const confirmRollback = async () => {
    setIsRollingBack(true);
    try {
      await adminService.rollbackRegeneration(rollbackMonth);
      // Refresh history after rollback
      await fetchHistory(rollbackMonth);
      showSuccess("Rollback berhasil dilakukan");
      setShowRollbackDialog(false);
    } catch (err: any) {
      console.error("Error rolling back regeneration:", err);
      showError(err.message || "Gagal melakukan rollback");
    } finally {
      setIsRollingBack(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "regenerate_fees":
        return <RefreshCw className="w-4 h-4" />;
      case "rollback":
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <History className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "regenerate_fees":
        return "bg-blue-100 text-blue-800";
      case "rollback":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "regenerate_fees":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rollback":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <History className="w-5 h-5" />
            Riwayat Regenerate Iuran
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {generateAvailableMonths().map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => fetchHistory(selectedMonth)}
              disabled={!selectedMonth || isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              {isLoading ? "Memuat..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!selectedMonth ? (
          <div className="text-center py-8 text-gray-500">
            Pilih bulan untuk melihat riwayat regenerate iuran
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat riwayat...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada riwayat regenerate iuran untuk bulan ini
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getActionIcon(item.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionColor(item.action)}>
                          {item.action.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {getStatusIcon(item.action)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>Admin:</strong> {item.admin_user}</p>
                        <p><strong>Waktu:</strong> {formatDateTimeWithPukul(item.timestamp)}</p>
                        {item.reason && (
                          <p><strong>Alasan:</strong> {item.reason}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-green-700 font-medium text-xs">Tagihan Dibayar</p>
                          <p className="text-base sm:text-lg font-bold text-green-800">
                            {item.paid_fees_preserved}
                          </p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <p className="text-orange-700 font-medium text-xs">Tagihan Diregenerate</p>
                          <p className="text-base sm:text-lg font-bold text-orange-800">
                            {item.unpaid_fees_regenerated}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-blue-700 font-medium text-xs">Tagihan Baru</p>
                          <p className="text-base sm:text-lg font-bold text-blue-800">
                            {item.details.new_fees_created}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-700 font-medium text-xs">Total Terpengaruh</p>
                          <p className="text-base sm:text-lg font-bold text-gray-800">
                            {item.affected_fees_count}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.action === "regenerate_fees" && (
                    <Button
                      onClick={() => handleRollback(item.month)}
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Rollback Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRollbackDialog}
        onClose={() => setShowRollbackDialog(false)}
        onConfirm={confirmRollback}
        title="Konfirmasi Rollback"
        description={`Apakah Anda yakin ingin melakukan rollback untuk bulan ${rollbackMonth}? Tindakan ini akan mengembalikan tagihan ke versi sebelumnya.`}
        confirmText="Ya, Rollback"
        cancelText="Batal"
        variant="warning"
        isLoading={isRollingBack}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Card>
  );
};

export default RegenerationHistory;
