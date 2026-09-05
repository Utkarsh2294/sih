import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { Compass, Map as MapIcon, MapPin, Navigation, Phone, Search, ShieldAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import schemes from '../data/schemes.config.json';
import partners from '../data/partners.mock.json';
import { healthTierMessage } from '../engine/partnerHealthEngine';
import { rankPartners } from '../engine/partnerRanking';
import Button from '../components/ui/Button';
import BottomSheet from '../components/ui/BottomSheet';
import Card from '../components/ui/Card';

const districts = { Pune: { latitude: 18.5204, longitude: 73.8567 }, Mumbai: { latitude: 19.076, longitude: 72.8777 }, Nashik: { latitude: 19.9975, longitude: 73.7898 } };
const tierStyles = { recommended: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200', available: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200', 'low-capacity': 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200', unknown: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' };
const pinColors = { recommended: '#059669', available: '#0284c7', 'low-capacity': '#d97706', unknown: '#64748b' };

const PartnerLocator = () => {
  const { t } = useTranslation();
  const selectedSchemeId = useAppStore((state) => state.selectedSchemeId);
  const selectScheme = useAppStore((state) => state.selectScheme);
  const setApplicationPartner = useAppStore((state) => state.selectPartnerForApplication);
  const mapNode = useRef(null); const mapRef = useRef(null); const layerRef = useRef(null);
  const [location, setLocation] = useState(districts.Pune); const [district, setDistrict] = useState('Pune');
  const [status, setStatus] = useState('manual'); const [mapView, setMapView] = useState(false); const [selected, setSelected] = useState(null);
  const scheme = schemes.find((item) => item.id === selectedSchemeId);
  const ranked = useMemo(() => selectedSchemeId ? rankPartners(partners, location, selectedSchemeId) : [], [location, selectedSchemeId]);

  const locate = () => {
    if (!navigator.geolocation) return setStatus('unavailable');
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(({ coords }) => { setLocation({ latitude: coords.latitude, longitude: coords.longitude }); setStatus('located'); }, () => setStatus('denied'), { timeout: 8000, maximumAge: 300000 });
  };
  const focusPartner = (partner) => { setSelected(partner); setMapView(true); mapRef.current?.setView([partner.latitude, partner.longitude], 13, { animate: true }); };

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return undefined;
    const map = L.map(mapNode.current).setView([districts.Pune.latitude, districts.Pune.longitude], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map); mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);
  // Preserve the Phase 3 hand-off for Phase 6 as soon as a citizen chooses a partner.
  useEffect(() => {
    if (selected && selectedSchemeId) setApplicationPartner(selected.id, selectedSchemeId);
  }, [selected, selectedSchemeId, setApplicationPartner]);
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    mapRef.current.setView([location.latitude, location.longitude], 10, { animate: true }); layerRef.current.clearLayers();
    ranked.forEach((partner) => {
      const isSelected = selected?.id === partner.id;
      const icon = L.divIcon({ className: 'vittsetu-map-pin', html: `<span style="background:${pinColors[partner.health.tier]};${isSelected ? 'transform:scale(1.25);box-shadow:0 0 0 4px rgba(13,148,136,.18);' : ''}"></span>`, iconSize: [28, 28], iconAnchor: [14, 14] });
      L.marker([partner.latitude, partner.longitude], { icon, title: partner.name }).on('click', () => setSelected(partner)).addTo(layerRef.current);
    });
  }, [location, ranked, selected]);

  const statusCopy = { locating: t('partnerLocator.locating', 'Finding your location…'), located: t('partnerLocator.located', 'Showing partners near your location'), denied: t('partnerLocator.denied', 'Location permission was not available. Showing your selected district.'), unavailable: t('partnerLocator.unavailable', 'Location is unavailable on this device. Choose a district below.'), manual: t('partnerLocator.manual', 'Showing partners near your selected district') }[status];
  return <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="mb-1 text-sm font-semibold text-primary-700 dark:text-primary-300">{t('partnerLocator.eyebrow', 'Capacity-aware routing')}</p><h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('partnerLocator.title', 'Find the right partner')}</h1><p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{t('partnerLocator.subtitle', 'We rank eligible partners by reported availability first, then distance — because nearest is not always best.')}</p></div><div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-900 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-100"><b>{t('partnerLocator.scheme', 'Scheme')}:</b> {scheme?.name || t('partnerLocator.chooseScheme', 'Choose a scheme below')}</div></div>
    <Card className="mb-5 p-4"><div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{t('partnerLocator.schemePicker', 'Scheme you want to use')}<select value={selectedSchemeId || ''} onChange={(event) => selectScheme(event.target.value || null)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"><option value="">{t('partnerLocator.selectScheme', 'Select a scheme')}</option>{schemes.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{t('partnerLocator.district', 'District')}<select value={district} onChange={(event) => { setDistrict(event.target.value); setLocation(districts[event.target.value]); setStatus('manual'); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">{Object.keys(districts).map((name) => <option key={name}>{name}</option>)}</select></label><Button variant="secondary" onClick={locate} icon={Navigation}>{t('partnerLocator.useLocation', 'Use my location')}</Button></div><p className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Compass className="h-4 w-4 text-primary-600" />{statusCopy}</p></Card>
    {selectedSchemeId ? <><section aria-label={t('partnerLocator.legendTitle', 'Capacity legend')} className="mb-5 flex flex-wrap gap-2">{Object.entries({ recommended: t('partnerLocator.recommended', 'Recommended'), available: t('partnerLocator.available', 'Available but further'), 'low-capacity': t('partnerLocator.lowCapacity', 'Currently low capacity'), unknown: t('partnerLocator.unknown', 'Capacity data not available') }).map(([tier, label]) => <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tierStyles[tier]}`} key={tier}><span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: pinColors[tier] }} />{label}</span>)}</section><div className="mb-4 flex justify-end lg:hidden"><Button variant="secondary" size="sm" icon={mapView ? X : MapIcon} onClick={() => setMapView(!mapView)}>{mapView ? t('partnerLocator.viewList', 'View list') : t('partnerLocator.viewMap', 'View map')}</Button></div><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]"><div className={`${mapView ? 'block' : 'hidden'} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block dark:border-slate-700`}><div ref={mapNode} className="h-[430px] w-full" aria-label={t('partnerLocator.mapLabel', 'Map of eligible partners')} /></div><div className={`${mapView ? 'hidden' : 'block'} max-h-[430px] space-y-3 overflow-y-auto pr-1 lg:block`} aria-live="polite">{ranked.map((partner, index) => <PartnerCard key={partner.id} partner={partner} index={index} active={selected?.id === partner.id} onSelect={() => focusPartner(partner)} t={t} />)}</div></div></> : <Card className="p-10 text-center"><Search className="mx-auto mb-3 h-10 w-10 text-primary-600" /><h2 className="text-xl font-semibold dark:text-white">{t('partnerLocator.selectPromptTitle', 'Select a scheme to see eligible partners')}</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{t('partnerLocator.selectPromptDesc', 'Only partners authorised for your selected scheme will appear here.')}</p></Card>}
    <BottomSheet isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name || ''}>{selected && <PartnerDetail partner={selected} schemeId={selectedSchemeId} setApplicationPartner={setApplicationPartner} t={t} />}</BottomSheet>
  </div>;
};

const PartnerCard = ({ partner, index, active, onSelect, t }) => <motion.button layout onClick={onSelect} className={`w-full rounded-2xl border p-4 text-left transition ${active ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-slate-200 bg-white hover:border-primary-300 dark:border-slate-700 dark:bg-slate-800'}`} aria-label={t('partnerLocator.viewPartner', 'View {{name}} details', { name: partner.name })}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-500">#{index + 1} · {partner.type}</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">{partner.name}</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{partner.distanceKm.toFixed(1)} km · {partner.district}</p></div><MapPin className="h-5 w-5 shrink-0 text-primary-600" /></div><div className="mt-3 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tierStyles[partner.health.tier]}`}>{partner.health.label}</span>{partner.healthSignal?.avgTurnaroundDays && <span className="text-xs text-slate-600 dark:text-slate-300">{t('partnerLocator.turnaround', 'About {{days}} days', { days: partner.healthSignal.avgTurnaroundDays })}</span>}</div></motion.button>;
const PartnerDetail = ({ partner, schemeId, setApplicationPartner, t }) => <div className="space-y-5"><div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tierStyles[partner.health.tier]}`}>{partner.health.label}</span><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{partner.type} · {partner.address}</p></div><div className={`rounded-xl p-4 ${tierStyles[partner.health.tier]}`}><div className="flex gap-2"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-sm font-medium">{healthTierMessage(partner.healthSignal, partner.health.tier)}</p></div></div><Link to={`/partner-locator/${partner.id}/report`} className="block text-center text-sm font-bold text-primary-700 underline dark:text-primary-300">View full report card</Link><div className="grid gap-3 sm:grid-cols-2"><a href={`tel:${partner.phone.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-600 px-4 font-medium text-white hover:bg-primary-700"><Phone className="mr-2 h-5 w-5" />{t('partnerLocator.call', 'Call partner')}</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-primary-600 px-4 font-medium text-primary-700 hover:bg-primary-50 dark:text-primary-300"><Navigation className="mr-2 h-5 w-5" />{t('partnerLocator.directions', 'Get directions')}</a></div><button type="button" disabled onClick={() => setApplicationPartner(partner.id, schemeId)} className="flex w-full items-center justify-center rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t('partnerLocator.startLater', 'Start application — coming in a later phase')}</button></div>;
export default PartnerLocator;
