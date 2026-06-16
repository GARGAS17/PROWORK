import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, Save, UserCircle2, Plus, X } from 'lucide-react';

export const FreelancerSettingsPage = () => {
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  
  const [techInput, setTechInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/profiles/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (res.ok && json.data) {
          setFullName(json.data.full_name || '');
          setBio(json.data.bio || '');
          setAvatarUrl(json.data.avatar_url || '');
          setHourlyRate(json.data.hourly_rate?.toString() || '');
          setSkills(json.data.skills || []);
        }
      } catch (err) {
        console.error('Error loading profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newSkill = techInput.trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
        setTechInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo de imagen válido.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen debe pesar menos de 5MB.' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:3000/api/profiles/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al subir la imagen');

      setAvatarUrl(json.data.avatar_url);
      setMessage({ type: 'success', text: 'Foto de perfil actualizada exitosamente' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        skills
      };

      const res = await fetch('http://localhost:3000/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al guardar el perfil');
      
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Configuración de Perfil
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Completa tu perfil para destacar ante las empresas en Prowork.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border-l-4 animate-in slide-in-from-top-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
            : 'bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400'
        }`}>
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm space-y-8">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg group-hover:opacity-50 transition-opacity" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30 transition-colors">
                <UserCircle2 className="w-12 h-12 text-indigo-300 dark:text-indigo-400" />
              </div>
            )}
            
            {/* Overlay de Carga */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}

            {/* Hover Indicator */}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">Cambiar</span>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Foto de Perfil</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Haz clic en la imagen para subir una desde tu computadora. Recomendamos una imagen cuadrada de al menos 400x400px (Max 5MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tarifa por Hora (USD)</label>
            <input
              type="number"
              min="0"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="25"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Biografía</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Soy un desarrollador apasionado por..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Tus Habilidades (Skills)
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Escribe una habilidad y presiona Enter para agregarla a tu perfil.
          </p>
          
          <div className="relative">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Ej. React, Node.js, Figma, SEO..."
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={(e) => handleAddSkill({ key: 'Enter', preventDefault: () => {} } as any)}
              className="absolute right-2 top-2 p-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map(skill => (
              <span 
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg group animate-in zoom-in-95"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Perfil
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
