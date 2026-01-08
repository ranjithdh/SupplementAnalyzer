import React from 'react';
import { ScrapedData, PageType } from '../types';

interface VisualDisplayProps {
  data: ScrapedData;
}

const VisualDisplay: React.FC<VisualDisplayProps> = ({ data }) => {
  const { pageType, metadata, coreEntity, productDetails, contentDetails } = data;

  // Split specifications into label-related and general ones
  const specifications = productDetails?.specifications || [];
  const labelSpecs = specifications.filter(s => 
    s.name.toLowerCase().includes('serving') || 
    s.name.toLowerCase().includes('container')
  );
  const otherSpecs = specifications.filter(s => !labelSpecs.includes(s));

  const getTypeColor = (type: PageType) => {
    switch (type) {
      case PageType.Product: return 'text-brand-accent border-brand-accent/30 bg-brand-accent/10';
      case PageType.Service: return 'text-brand-accent border-brand-accent/30 bg-brand-accent/10';
      case PageType.Content: return 'text-brand-normal border-brand-normal/30 bg-brand-normal/10';
      default: return 'text-brand-secondary border-brand-secondary/30 bg-brand-secondary/10';
    }
  };

  // Helper to format ingredients into chips
  const renderIngredients = (ingredients: string | null) => {
    if (!ingredients) return null;
    const list = ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0);
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {list.map((item, idx) => {
          const isHighlight = item.toLowerCase().includes('extract') || item.toLowerCase().includes('organic');
          return (
            <span key={idx} className={`px-2 py-1 border rounded text-[11px] font-medium transition-all hover:scale-105 cursor-default ${
              isHighlight 
                ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent' 
                : 'bg-brand-bg/50 border-brand-tertiary text-brand-secondary'
            }`}>
              {item}
            </span>
          );
        })}
      </div>
    );
  };

  const getIconForSpec = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('weight') || n.includes('size')) return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 12h12l3-12H3z" /></svg>;
    if (n.includes('count') || n.includes('quantity')) return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>;
    if (n.includes('origin') || n.includes('country')) return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1a2.5 2.5 0 002.5-2.5V10a2 2 0 012-2h1.065" /></svg>;
    return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  };

  const getHighlights = () => {
    if (!productDetails?.nutritionalInformation) return [];
    const targets = ['calories', 'protein', 'total fat', 'total carbohydrate', 'sugar', 'sodium'];
    return productDetails.nutritionalInformation
      .filter(item => targets.some(t => item.element.toLowerCase().includes(t)))
      .slice(0, 4);
  };

  const highlights = getHighlights();

  return (
    <div className="">
      {/* Header Card */}
      <div className="bg-brand-fg/50 rounded-xl p-6 border border-brand-tertiary mb-6 backdrop-blur-sm shadow-lg transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="w-full md:w-1/3 flex-shrink-0">
             <div className="relative bg-white rounded-xl p-4 flex items-center justify-center overflow-hidden border border-brand-outline shadow-2xl min-h-[240px] group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-accent/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[2000ms] ease-in-out pointer-events-none z-10"></div>
                <div className="absolute top-2 left-2 z-20">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse delay-75"></div>
                  </div>
                </div>
                {coreEntity.image ? (
                  <img 
                    src={coreEntity.image} 
                    alt={coreEntity.name || 'Product Image'} 
                    className="w-full h-auto max-h-[300px] object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs uppercase tracking-widest font-bold opacity-30">Image Not Available</span>
                  </div>
                )}
             </div>
          </div>

          {/* Title & Core Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getTypeColor(pageType)}`}>
                {pageType}
              </span>
              {coreEntity.brand && (
                 <span className="text-[10px] font-bold text-brand-secondary bg-brand-tertiary px-2 py-1 rounded border border-brand-tertiary uppercase tracking-wider">
                   {coreEntity.brand}
                 </span>
              )}
            </div>
            
            <h2 className="text-3xl font-black text-brand-primary leading-tight mb-2 tracking-tight">{coreEntity.name || metadata.title || 'Untitled Entity'}</h2>
            <p className="text-brand-accent text-sm font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-accent"></span>
              {coreEntity.category || 'General Product'}
            </p>

            {/* Price Display */}
            {productDetails?.price && (productDetails.price.amount || productDetails.price.currency) && (
                <div className="mb-6 inline-flex flex-col bg-brand-bg/80 border border-brand-tertiary rounded-xl px-5 py-3 shadow-inner">
                    <span className="text-brand-secondary text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">Verified Price</span>
                    <div className="text-2xl font-black text-brand-primary flex items-baseline gap-1">
                        <span className="text-brand-accent text-lg">{productDetails.price.currency || '$'}</span>
                        {productDetails.price.amount}
                    </div>
                </div>
            )}
            
            {/* Core Links */}
            <div className="flex flex-wrap gap-3 mt-auto">
                {metadata.canonicalUrl && (
                    <a href={metadata.canonicalUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center text-white font-bold text-xs transition bg-brand-accent px-5 py-2.5 rounded-lg hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/20 active:scale-95">
                        <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        View Original Source
                    </a>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details View */}
      {productDetails && (
        <div className="space-y-8">
          
          {/* Dashboard Highlights */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {highlights.map((item, idx) => (
                 <div key={idx} className="bg-gradient-to-br from-brand-accent/10 to-transparent border border-brand-accent/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:border-brand-accent/40 transition-all group">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-1 opacity-70 group-hover:text-brand-accent transition-colors">{item.element}</span>
                    <span className="text-xl font-black text-brand-primary tracking-tight">{item.amount}</span>
                    {item.dailyValue && (
                      <span className="text-[9px] font-bold text-brand-normal mt-1 bg-brand-normal/10 px-1.5 py-0.5 rounded uppercase">{item.dailyValue} DV</span>
                    )}
                 </div>
               ))}
            </div>
          )}

          {/* General Specifications Grid (Exclude Serving info) */}
          {otherSpecs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherSpecs.map((spec, idx) => (
                <div key={idx} className="bg-brand-fg/30 border border-brand-tertiary p-4 rounded-xl flex flex-col gap-1 shadow-sm transition-all hover:bg-brand-fg/50 duration-300 group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-brand-accent opacity-40 group-hover:opacity-100 transition-opacity">
                      {getIconForSpec(spec.name)}
                    </div>
                    <span className="text-brand-secondary text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-80 transition-opacity">{spec.name}</span>
                  </div>
                  <span className="text-brand-primary font-bold text-sm truncate">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Supplement Facts / Nutritional Info Table */}
          {(productDetails.nutritionalInformation?.length > 0 || productDetails.labelImage) && (
            <div className="bg-white text-black rounded-xl p-6 border-4 border-black font-sans shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                 <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              
              <h3 className="text-4xl font-black border-b-[8px] border-black pb-1 mb-2 leading-none italic uppercase tracking-tighter">Supplement Facts</h3>
              
              {/* Serving Specs Inside Label */}
              {labelSpecs.length > 0 && (
                <div className="mb-3 border-b-[4px] border-black pb-2">
                   {labelSpecs.map((spec, idx) => (
                      <div key={idx} className="text-base font-black flex justify-between">
                        <span>{spec.name}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                   ))}
                </div>
              )}

              {/* Label Image if found */}
              {productDetails.labelImage && (
                  <div className="mb-6 relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-100 shadow-inner" onClick={() => window.open(productDetails.labelImage!, '_blank')}>
                      <img 
                          src={productDetails.labelImage} 
                          alt="Supplement Facts Label" 
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm transition-all transform translate-y-4 group-hover:translate-y-0">
                              Expand Label View
                          </span>
                      </div>
                  </div>
              )}

              {/* Data Table */}
              {productDetails.nutritionalInformation && productDetails.nutritionalInformation.length > 0 && (
                  <>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-[4px] border-black">
                            <th className="text-left py-2 font-black uppercase text-xs">Amount Per Serving</th>
                            <th className="text-right py-2 font-black uppercase text-xs w-20">%DV</th>
                          </tr>
                        </thead>
                        <tbody>
                        {productDetails.nutritionalInformation.map((item, idx) => {
                          const dvValue = item.dailyValue?.replace(/[^0-9]/g, '');
                          const dvPercent = dvValue ? parseInt(dvValue) : 0;
                          return (
                            <tr key={idx} className="border-b-2 border-black last:border-b-[6px] group relative">
                              <td className="py-2 relative z-10">
                                <div className="flex justify-between items-baseline">
                                  <span className="font-black text-base group-hover:translate-x-1 transition-transform duration-300">{item.element}</span>
                                  <span className="ml-2 font-medium text-gray-700">{item.amount}</span>
                                </div>
                              </td>
                              <td className="text-right py-2 align-bottom font-black text-base relative z-10 w-24">
                                <span className="relative z-20">{item.dailyValue || '—'}</span>
                                {dvPercent > 0 && (
                                  <div 
                                    className="absolute inset-y-0 right-0 bg-black/[0.03] transition-all duration-1000 ease-out z-0" 
                                    style={{ width: `${Math.min(dvPercent, 100)}%` }}
                                  ></div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </table>
                      <div className="text-[11px] mt-4 font-bold italic leading-tight">
                        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                        <br/>
                        ** Daily Value not established.
                      </div>
                  </>
              )}
            </div>
          )}

          {/* Text Blocks */}
          <div className="grid grid-cols-1 gap-6">
             {productDetails.description && (
                <div className="bg-brand-fg/20 p-6 rounded-2xl border border-brand-tertiary relative overflow-hidden group transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-2 mb-3">
                     <svg className="w-3.5 h-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <h3 className="text-brand-accent font-black text-xs uppercase tracking-widest">Product Intelligence</h3>
                  </div>
                  <p className="text-brand-primary text-sm whitespace-pre-line leading-relaxed opacity-90 selection:bg-brand-accent/30">{productDetails.description}</p>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productDetails.suggestedUse && (
                   <div className="bg-brand-fg/20 p-6 rounded-2xl border border-brand-tertiary relative overflow-hidden group transition-colors duration-300">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-normal opacity-50 group-hover:opacity-100 transition-opacity"></div>
                     <h3 className="text-brand-normal font-black text-xs uppercase tracking-widest mb-3">Suggested Use</h3>
                     <p className="text-brand-primary text-sm leading-relaxed opacity-90">{productDetails.suggestedUse}</p>
                   </div>
                )}

                {productDetails.warnings && (
                   <div className="bg-brand-high/10 p-6 rounded-2xl border border-brand-high/20 relative overflow-hidden group transition-colors duration-300">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-high opacity-50 group-hover:opacity-100 transition-opacity"></div>
                     <h3 className="text-brand-high font-black text-xs uppercase tracking-widest mb-3">Safety Warnings</h3>
                     <p className="text-brand-primary text-sm leading-relaxed opacity-90">{productDetails.warnings}</p>
                   </div>
                )}
             </div>

             {productDetails.ingredients && (
                <div className="bg-brand-fg/20 p-6 rounded-2xl border border-brand-tertiary relative overflow-hidden group transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-secondary opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="text-brand-secondary font-black text-xs uppercase tracking-widest mb-1">Other Ingredients</h3>
                  {renderIngredients(productDetails.ingredients)}
                </div>
             )}
             
             {productDetails.disclaimer && (
                <div className="p-4 rounded-xl border border-brand-tertiary bg-brand-bg/30 mt-4">
                  <div className="flex items-start gap-3">
                     <svg className="w-4 h-4 text-brand-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <div>
                        <h3 className="text-brand-secondary font-black text-[10px] uppercase tracking-widest mb-1">Medical Disclaimer</h3>
                        <p className="text-brand-secondary text-[11px] leading-relaxed italic opacity-60">{productDetails.disclaimer}</p>
                     </div>
                  </div>
                </div>
             )}
          </div>
        </div>
      )}

      {/* Content Details View (Fallback for articles/blogs) */}
      {contentDetails && (
          <div className="space-y-6">
               <div className="bg-brand-fg/40 p-8 rounded-2xl border border-brand-tertiary shadow-xl transition-colors duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-brand-tertiary pb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                         </div>
                         <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary opacity-50">Author</span>
                            <span className="text-brand-primary font-bold">{contentDetails.author || 'Anonymous'}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary opacity-50">Published</span>
                         <span className="text-brand-primary font-bold">{contentDetails.publishDate || 'Unknown Date'}</span>
                      </div>
                  </div>
                  
                  <h3 className="text-brand-accent font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-6 h-px bg-brand-accent/30"></span>
                     Executive Summary
                  </h3>
                  <p className="text-brand-primary text-lg leading-relaxed mb-8 font-medium italic opacity-90">"{contentDetails.mainContent}"</p>
                  
                  {contentDetails.headings && contentDetails.headings.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-brand-tertiary">
                          <h4 className="text-brand-secondary text-[10px] font-black uppercase tracking-widest mb-4">Key Topics & Architecture</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {contentDetails.headings.map((head, i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 bg-brand-bg/50 rounded-lg border border-brand-tertiary group hover:border-brand-accent/30 transition-colors">
                                     <span className="text-brand-accent font-mono text-xs opacity-50">0{i+1}</span>
                                     <span className="text-brand-primary text-sm font-semibold">{head}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
               </div>
          </div>
      )}
    </div>
  );
};

export default VisualDisplay;