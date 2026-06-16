import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Wallet, Loader2, ArrowRight, ShieldCheck, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

interface AdminPayment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  projects?: {
    title: string;
    budget_min: number;
    budget_max: number;
  };
  freelancers?: { profiles?: { full_name: string } | { full_name: string }[] };
  companies?: { profiles?: { full_name: string } | { full_name: string }[] };
}

export const AdminPaymentsPage = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [stats, setStats] = useState({
    totalCommission: 0,
    totalPendingEscrow: 0,
    confirmedPaymentsCount: 0,
    pendingPaymentsCount: 0
  });

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        fetch('http://localhost:3000/api/payments/pendientes', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3000/api/payments/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (paymentsRes.ok) {
        const json = await paymentsRes.json();
        setPayments(json.data || []);
      }
      if (statsRes.ok) {
        const jsonStats = await statsRes.json();
        setStats(jsonStats.data || {
          totalCommission: 0,
          totalPendingEscrow: 0,
          confirmedPaymentsCount: 0,
          pendingPaymentsCount: 0
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  const handleRelease = async (paymentId: string) => {
    setProcessingId(paymentId);
    setSuccessMsg('');
    try {
      const res = await fetch(`http://localhost:3000/api/payments/${paymentId}/release`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Error al liberar el pago');
      }
      setSuccessMsg('Pago desembolsado exitosamente. Se descontó 10% de comisión.');
      await fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Error al procesar el pago');
    } finally {
      setProcessingId(null);
    }
  };

  const getProfileName = (userObj: any) => {
    if (!userObj?.profiles) return 'Usuario Desconocido';
    return Array.isArray(userObj.profiles) ? userObj.profiles[0]?.full_name : userObj.profiles.full_name;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Gestión de Desembolsos
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Revisa los proyectos finalizados y libera los pagos a los freelancers. Prowork retiene un 10% de comisión automática.
        </p>
      </div>

      {/* Tarjetas de Estadísticas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 font-bold uppercase tracking-wider text-xs mb-2">Comisiones Totales</p>
            <h2 className="text-3xl font-black">${stats.totalCommission.toFixed(2)}</h2>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-1"><Clock className="w-4 h-4" /> En Escrow</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">${stats.totalPendingEscrow.toFixed(2)}</h2>
          <p className="text-xs text-gray-400 mt-1">Pendiente de revisión</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Confirmados</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">{stats.confirmedPaymentsCount}</h2>
          <p className="text-xs text-gray-400 mt-1">Pagos liberados</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-1"><Wallet className="w-4 h-4 text-amber-500" /> Pendientes</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">{stats.pendingPaymentsCount}</h2>
          <p className="text-xs text-gray-400 mt-1">Por desembolsar</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-xl">
          <p className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            {successMsg}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Todo al día</h3>
          <p className="text-gray-500 dark:text-gray-400">No hay pagos pendientes de revisión administrativa.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => {
            const amount = Number(payment.amount);
            const commission = amount * 0.10;
            const freelancerNet = amount - commission;

            return (
              <div key={payment.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 rounded-full text-xs font-bold mb-3 inline-block">
                    Pendiente de Desembolso
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {payment.projects?.title || 'Proyecto Sin Título'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      <span className="font-bold text-gray-900 dark:text-gray-300">Empresa:</span> {getProfileName(payment.companies)}
                    </p>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                    <p>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Freelancer:</span> {getProfileName(payment.freelancers)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl flex items-center gap-6 shrink-0 border border-gray-100 dark:border-gray-800">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Monto Total</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">${amount.toFixed(2)}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Neto Freelancer</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">${freelancerNet.toFixed(2)}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-500 uppercase">Comisión (10%)</p>
                    <p className="text-xl font-black text-purple-600 dark:text-purple-400">${commission.toFixed(2)}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <button
                    onClick={() => handleRelease(payment.id)}
                    disabled={processingId === payment.id}
                    className="w-full lg:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === payment.id ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5" /> Aprobar Desembolso</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
