import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Share2, Copy, Check } from 'lucide-react';

export const ShoppingListView: React.FC = () => {
  const {
    shoppingList,
    addCustomShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    clearBoughtItems,
    clearAllShoppingItems,
    showToast,
  } = useApp();

  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemAmount, setNewItemAmount] = useState<string>('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addCustomShoppingItem(newItemName, newItemAmount);
    setNewItemName('');
    setNewItemAmount('');
  };

  const boughtCount = shoppingList.filter((item) => item.isBought).length;
  const totalCount = shoppingList.length;

  const copyShoppingListToClipboard = async () => {
    if (shoppingList.length === 0) return;

    const unbought = shoppingList.filter((i) => !i.isBought);
    const bought = shoppingList.filter((i) => i.isBought);

    let text = '🛒 *DAFTAR BELANJA MASA KAN NUSANTARA*\n\n';

    if (unbought.length > 0) {
      text += '📍 *Belum Dibeli:*\n';
      unbought.forEach((item) => {
        text += `- [ ] ${item.name} ${item.amount ? `(${item.amount})` : ''} ${
          item.recipeTitle ? `[Resep: ${item.recipeTitle}]` : ''
        }\n`;
      });
    }

    if (bought.length > 0) {
      text += '\n✅ *Sudah Dibeli:*\n';
      bought.forEach((item) => {
        text += `- [x] ~${item.name}~ ${item.amount ? `(${item.amount})` : ''}\n`;
      });
    }

    await navigator.clipboard.writeText(text);
    showToast('📋 Daftar belanja disalin ke clipboard!', 'success');
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-800 to-amber-950 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" /> Bahan Dapur & Pasar
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">Daftar Belanja</h2>
          <p className="text-xs text-amber-100/80 mt-1">
            Bahan dari resep otomatis tercatat di sini untuk mempermudah belanja di pasar.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={copyShoppingListToClipboard}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-semibold flex items-center gap-1"
              title="Salin Teks"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={clearAllShoppingItems}
              className="p-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors text-xs font-semibold"
              title="Hapus Semua"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Item Form */}
      <form
        onSubmit={handleAddItem}
        className="p-4 rounded-3xl bg-white dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col sm:flex-row gap-2"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Tambah bahan manual (misal: Daun Pandan)..."
          className="flex-1 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 focus:outline-none"
        />
        <input
          type="text"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
          placeholder="Jumlah (misal: 3 lembar)"
          className="w-full sm:w-40 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-2xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-700 transition-all flex items-center justify-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </form>

      {/* Progress & Items List */}
      {totalCount > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-amber-300">
            <span>
              Progres Belanja: {boughtCount} / {totalCount} Terbeli
            </span>
            {boughtCount > 0 && (
              <button
                onClick={clearBoughtItems}
                className="text-amber-700 dark:text-amber-400 hover:underline"
              >
                Hapus yang Sudah Dibeli
              </button>
            )}
          </div>

          <div className="space-y-2">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleShoppingItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  item.isBought
                    ? 'bg-amber-100/50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/40 text-stone-400 line-through'
                    : 'bg-white dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/60 text-amber-950 dark:text-amber-100 hover:border-amber-400 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      item.isBought
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900'
                    }`}
                  >
                    {item.isBought && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">{item.name}</span>
                    {item.recipeTitle && (
                      <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 block">
                        Resep: {item.recipeTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.amount && (
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-2.5 py-1 rounded-lg">
                      {item.amount}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteShoppingItem(item.id);
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-10 text-center bg-white dark:bg-amber-950/40 rounded-3xl border border-amber-200/60 dark:border-amber-800/40 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg font-serif text-amber-950 dark:text-amber-100">
            Daftar Belanja Masih Kosong
          </h3>
          <p className="text-xs text-stone-600 dark:text-amber-200/70 max-w-sm mx-auto leading-relaxed">
            Buka detail resep mana pun lalu tekan tombol "🛒 + Daftar Belanja" untuk memasukkan bahan-bahannya secara otomatis ke sini.
          </p>
        </div>
      )}
    </div>
  );
};
