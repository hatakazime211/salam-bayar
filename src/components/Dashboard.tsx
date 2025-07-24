import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/hooks/useStudents";
import { usePayments } from "@/hooks/usePayments";
import { 
  Users, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  MessageSquare,
  FileText,
  CalendarDays
} from "lucide-react";

const Dashboard = () => {
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();

  // Calculate real statistics
  const stats = {
    totalSiswa: students.length,
    sudahBayar: payments.filter(p => p.status === 'paid').length,
    belumBayar: payments.filter(p => p.status === 'pending' || p.status === 'overdue').length,
    totalPendapatan: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount), 0),
    tunggakan: payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + Number(p.amount), 0)
  };

  const recentPayments = payments.slice(0, 4).map(payment => ({
    id: payment.id,
    nama: payment.students?.name || 'Unknown',
    kelas: payment.students?.class || 'Unknown',
    bulan: payment.month_year,
    jumlah: Number(payment.amount),
    status: payment.status === 'paid' ? 'Lunas' : 'Tunggakan'
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-hero rounded-xl p-8 text-white shadow-elegant">
          <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-white/90">Sistem Informasi Pembayaran SPP</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card-hover hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSiswa}</div>
              <p className="text-xs text-muted-foreground">
                Siswa aktif
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-hover hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Bayar</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.sudahBayar}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.sudahBayar / stats.totalSiswa) * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-hover hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.belumBayar}</div>
              <p className="text-xs text-muted-foreground">
                Perlu follow up
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-hover hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalPendapatan)}</div>
              <p className="text-xs text-muted-foreground">
                Bulan ini
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="hero" size="lg" className="h-20 flex-col">
            <MessageSquare className="h-6 w-6 mb-2" />
            Kirim Notifikasi WhatsApp
          </Button>
          <Button variant="default" size="lg" className="h-20 flex-col">
            <Users className="h-6 w-6 mb-2" />
            Kelola Data Siswa
          </Button>
          <Button variant="success" size="lg" className="h-20 flex-col">
            <FileText className="h-6 w-6 mb-2" />
            Generate Laporan
          </Button>
        </div>

        {/* Recent Payments */}
        <Card className="bg-gradient-card border-0 shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pembayaran Terbaru
            </CardTitle>
            <CardDescription>
              Daftar pembayaran yang baru diterima
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                  <div>
                    <h4 className="font-medium">{payment.nama}</h4>
                    <p className="text-sm text-muted-foreground">{payment.kelas} • {payment.bulan}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(payment.jumlah)}</p>
                    <Badge 
                      variant={payment.status === "Lunas" ? "default" : "destructive"}
                      className={payment.status === "Lunas" ? "bg-success text-success-foreground" : ""}
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card-hover">
            <CardHeader>
              <CardTitle>Jadwal Reminder</CardTitle>
              <CardDescription>Pengingat otomatis untuk pembayaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="text-sm">Reminder H-3 jatuh tempo</span>
                </div>
                <Badge variant="outline">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-warning" />
                  <span className="text-sm">Reminder tunggakan</span>
                </div>
                <Badge variant="outline">Aktif</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-hover">
            <CardHeader>
              <CardTitle>Tunggakan Tertinggi</CardTitle>
              <CardDescription>Siswa dengan tunggakan terbesar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Budi Santoso</span>
                  <span className="text-sm font-medium text-destructive">{formatCurrency(1050000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maria Magdalena</span>
                  <span className="text-sm font-medium text-destructive">{formatCurrency(700000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Joko Susilo</span>
                  <span className="text-sm font-medium text-destructive">{formatCurrency(350000)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;