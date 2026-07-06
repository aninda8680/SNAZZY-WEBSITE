import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import api from '../../api/client'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  in_stock: boolean
  stock_quantity: number
  badge?: string
  categories?: { name: string }
}

interface ProductForm {
  name: string
  tagline: string
  price: string
  original_price: string
  badge: string
  category_id: string
  stock_quantity: string
  in_stock: boolean
}

const emptyForm: ProductForm = {
  name: '', tagline: '', price: '', original_price: '',
  badge: '', category_id: '', stock_quantity: '0', in_stock: true,
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null })
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/products'),
      api.get('/api/products/category/pure-luxe').catch(() => ({ data: {} })),
    ]).then(([p]) => {
      setProducts(p.data.products || [])
    }).finally(() => setLoading(false))

    // Fetch categories via products endpoint workaround
    api.get('/api/admin/products').then((r) => {
      const cats = Array.from(
        new Map(
          (r.data.products || [])
            .filter((p: any) => p.categories)
            .map((p: any) => [p.categories.slug ?? p.category_id, { id: p.category_id, ...p.categories }])
        ).values()
      )
      setCategories(cats as any[])
    })
  }, [])

  function openAdd() {
    setForm(emptyForm)
    setModal({ open: true, editing: null })
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      tagline: (p as any).tagline || '',
      price: String(p.price),
      original_price: String(p.original_price || ''),
      badge: p.badge || '',
      category_id: (p as any).category_id || '',
      stock_quantity: String(p.stock_quantity),
      in_stock: p.in_stock,
    })
    setModal({ open: true, editing: p })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseInt(form.price),
        original_price: form.original_price ? parseInt(form.original_price) : null,
        stock_quantity: parseInt(form.stock_quantity),
        slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }
      if (modal.editing) {
        const { data } = await api.put(`/api/admin/products/${modal.editing.id}`, payload)
        setProducts((prev) => prev.map((p) => p.id === data.product.id ? data.product : p))
      } else {
        const { data } = await api.post('/api/admin/products', payload)
        setProducts((prev) => [data.product, ...prev])
      }
      setModal({ open: false, editing: null })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await api.delete(`/api/admin/products/${id}`)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bodoni font-black text-3xl text-white">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-inter font-bold text-xs tracking-[0.2em] uppercase hover:bg-emerald-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-white/40">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-inter text-sm">Loading…</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Name', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => (
                  <th key={h} className="text-left pb-3 font-inter text-[10px] tracking-[0.3em] uppercase text-white/30 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map((p) => (
                <tr key={p.id} className="group">
                  <td className="py-4 pr-4">
                    <p className="font-inter text-sm font-bold text-white">{p.name}</p>
                    {p.badge && <span className="font-inter text-[10px] text-emerald-400">{p.badge}</span>}
                  </td>
                  <td className="py-4 pr-4 font-inter text-xs text-white/40">
                    {p.categories?.name || '—'}
                  </td>
                  <td className="py-4 pr-4 font-inter text-sm text-white">
                    ₹{(p.price / 100).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 pr-4 font-inter text-sm text-white/60">
                    {p.stock_quantity}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`font-inter text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-full ${
                      p.in_stock ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                    }`}>
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-white/40 hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <h2 className="font-bodoni font-bold text-white text-lg">
                {modal.editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'tagline', label: 'Tagline', type: 'text' },
                { key: 'price', label: 'Price (paise — ₹1 = 100)', type: 'number' },
                { key: 'original_price', label: 'Original Price (paise, optional)', type: 'number' },
                { key: 'badge', label: 'Badge', type: 'text' },
                { key: 'stock_quantity', label: 'Stock Quantity', type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block font-inter text-xs tracking-[0.2em] uppercase text-white/40 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof ProductForm] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 font-inter text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              ))}

              <div>
                <label className="block font-inter text-xs tracking-[0.2em] uppercase text-white/40 mb-1.5">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  className="w-full bg-[#111] border border-white/10 rounded-sm px-4 py-2.5 font-inter text-sm text-white focus:outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-500"
                />
                <span className="font-inter text-sm text-white/70">In Stock</span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-emerald-600 text-white font-inter font-bold text-xs tracking-[0.2em] uppercase hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving…' : modal.editing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
