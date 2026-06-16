import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Wallet, Loader2, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

interface Payment {
  id: string;
  project_id: string;
  amount: number;
  status: string;
  created_at: string;
  projects?: {
    title: string;
  };
}

export const WalletEmpresaPage = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/payments/mis-pagos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) {
          setPayments(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  const totalPaid = payments.filter(p => p.status === 'released').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalEscrow = payments.filter(p => p.status === 'escrow' || p.status === 'pending_admin').reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Pagos y Facturación
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Gestiona tus pagos realizados y fondos en garantía (Escrow).</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Total Pagado a Freelancers</p>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white">${totalPaid.toFixed(2)}</h2>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Fondos ya liberados en proyectos finalizados.</p>
          </div>
          <ArrowUpRight className="absolute -right-8 -bottom-8 w-48 h-48 text-gray-100 dark:text-gray-800" />
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 font-bold uppercase tracking-wider text-sm mb-2">Fondos en Garantía (Escrow)</p>
            <h2 className="text-5xl font-black">${totalEscrow.toFixed(2)}</h2>
            <p className="mt-4 text-sm text-indigo-200 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Dinero retenido por Prowork.
            </p>
          </div>
          <Wallet className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-10" />
        </div>
      </div>

      {/* Historial */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Historial de Transacciones</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center">
            <Wallet className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">Aún no hay transacciones</p>
            <p className="text-gray-500 dark:text-gray-400">Tus pagos aparecerán aquí cuando contrates freelancers.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  {payment.status === 'released' ? (
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{payment.projects?.title || 'Proyecto Desconocido'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(payment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black text-gray-900 dark:text-white">-${payment.amount}</p>
                  {payment.status === 'released' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Pago Liberado
                    </span>
                  ) : payment.status === 'pending_admin' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                      En Revisión de Prowork
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      En Garantía (Escrow)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
