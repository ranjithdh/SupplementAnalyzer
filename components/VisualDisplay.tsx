import React from 'react';
import { ScrapedData, PageType } from '../types';

interface VisualDisplayProps {
  data: ScrapedData;
}

const VisualDisplay: React.FC<VisualDisplayProps> = ({ data }) => {
  const { pageType, metadata, coreEntity, productDetails, contentDetails } = data;

  const getTypeColor = (type: PageType) => {
    switch (type) {
      case PageType.Product: return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case PageType.Service: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case PageType.Content: return 'text-green-400 border-green-400/30 bg-green-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  // Helper to separate label specs (Serving Size, etc) from general specs (SKU, etc)
  const isLabelSpec = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('serving') || n.includes('servings');
  };

  const labelSpecs = productDetails?.specifications?.filter(s => isLabelSpec(s.name)) || [];
  const otherSpecs = productDetails?.specifications?.filter(s => !isLabelSpec(s.name)) || [];

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Header Card */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          {coreEntity.image ? (
            <div className="w-full md:w-1/3 flex-shrink-0">
               <div className="relative bg-white rounded-lg p-4 flex items-center justify-center overflow-hidden border border-gray-600 shadow-md min-h-[200px]">
                  <img 
                    src={coreEntity.image} 
                    alt={coreEntity.name || 'Product Image'} 
                    className="w-full h-auto max-h-[300px] object-contain"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
               </div>
            </div>
          ) : null}

          {/* Title & Core Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getTypeColor(pageType)}`}>
                {pageType}
              </span>
              {coreEntity.brand && (
                 <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                   {coreEntity.brand}
                 </span>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white leading-tight mb-2">{coreEntity.name || metadata.title || 'Untitled'}</h2>
            <p className="text-gray-400 text-sm mb-4">{coreEntity.category || 'Uncategorized'}</p>

            {/* Price Display */}
            {productDetails?.price && (productDetails.price.amount || productDetails.price.currency) && (
                <div className="mb-4 inline-block bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-xs uppercase font-bold block mb-1">Price</span>
                    <div className="text-xl font-bold text-white flex items-center">
                        {productDetails.price.currency || '$'} {productDetails.price.amount}
                    </div>
                </div>
            )}
            
            {/* Core Links */}
            <div className="flex flex-wrap gap-2 text-sm mt-auto">
                {metadata.canonicalUrl && (
                    <a href={metadata.canonicalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300 transition bg-blue-500/10 px-3 py-1.5 rounded-md hover:bg-blue-500/20">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        View Original Page
                    </a>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details View */}
      {productDetails && (
        <div className="space-y-6">
          
          {/* General Specifications Grid (Exclude Serving info) */}
          {otherSpecs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherSpecs.map((spec, idx) => (
                <div key={idx} className="bg-gray-800/30 border border-gray-700 p-3 rounded flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{spec.name}</span>
                  <span className="text-white font-medium text-sm text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Supplement Facts / Nutritional Info Table */}
          {(productDetails.nutritionalInformation?.length > 0 || productDetails.labelImage) && (
            <div className="bg-white text-black rounded-lg p-4 border-2 border-gray-300 font-sans shadow-lg">
              <h3 className="text-3xl font-black border-b-[6px] border-black pb-1 mb-2 leading-none">Supplement Facts</h3>
              
              {/* Serving Specs Inside Label */}
              {labelSpecs.length > 0 && (
                <div className="mb-2 border-b-[4px] border-black pb-2">
                   {labelSpecs.map((spec, idx) => (
                      <div key={idx} className="text-sm font-bold flex gap-1">
                        <span>{spec.name}:</span>
                        <span className="font-normal">{spec.value}</span>
                      </div>
                   ))}
                </div>
              )}

              {/* Label Image if found */}
              {productDetails.labelImage && (
                  <div className="mb-4 relative group cursor-pointer" onClick={() => window.open(productDetails.labelImage!, '_blank')}>
                      <img 
                          src={productDetails.labelImage} 
                          alt="Supplement Facts Label" 
                          className="w-full h-auto border border-gray-300 rounded"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm transition">
                              Open Full Size
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
                            <th className="text-left py-1 font-bold">Amount Per Serving</th>
                            <th className="text-right py-1 font-bold w-20">%DV</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetails.nutritionalInformation.map((item, idx) => (
                            <tr key={idx} className="border-b border-black last:border-b-[4px]">
                              <td className="py-1">
                                <div className="flex justify-between">
                                  <span className="font-semibold">{item.element}</span>
                                  <span className="ml-2">{item.amount}</span>
                                </div>
                              </td>
                              <td className="text-right py-1 align-top font-medium">{item.dailyValue || '**'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-[10px] mt-2 font-medium">
                        ** Daily Value (DV) not established.
                      </div>
                  </>
              )}
            </div>
          )}

          {/* Text Blocks */}
          <div className="space-y-4">
             {productDetails.description && (
                <div className="bg-gray-800/20 p-4 rounded border-l-2 border-blue-500">
                  <h3 className="text-blue-400 font-bold text-sm uppercase mb-2">Product Overview</h3>
                  <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{productDetails.description}</p>
                </div>
             )}

             {productDetails.suggestedUse && (
                <div className="bg-gray-800/20 p-4 rounded border-l-2 border-green-500">
                  <h3 className="text-green-400 font-bold text-sm uppercase mb-2">Suggested Use</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{productDetails.suggestedUse}</p>
                </div>
             )}

             {productDetails.ingredients && (
                <div className="bg-gray-800/20 p-4 rounded border-l-2 border-purple-500">
                  <h3 className="text-purple-400 font-bold text-sm uppercase mb-2">Other Ingredients</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{productDetails.ingredients}</p>
                </div>
             )}

             {productDetails.warnings && (
                <div className="bg-red-900/10 p-4 rounded border-l-2 border-red-500">
                  <h3 className="text-red-400 font-bold text-sm uppercase mb-2">Warnings</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{productDetails.warnings}</p>
                </div>
             )}
             
             {productDetails.disclaimer && (
                <div className="p-4 rounded border border-gray-800 bg-gray-900/50">
                  <h3 className="text-gray-500 font-bold text-xs uppercase mb-1">Disclaimer</h3>
                  <p className="text-gray-500 text-xs leading-relaxed italic">{productDetails.disclaimer}</p>
                </div>
             )}
          </div>
        </div>
      )}

      {/* Content Details View (Fallback for articles/blogs) */}
      {contentDetails && (
          <div className="space-y-6">
               <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                      <span className="text-gray-400 text-sm">Author: <span className="text-white">{contentDetails.author || 'Unknown'}</span></span>
                      <span className="text-gray-400 text-sm">Date: <span className="text-white">{contentDetails.publishDate || 'Unknown'}</span></span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{contentDetails.mainContent}</p>
                  
                  {contentDetails.headings && contentDetails.headings.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                          <h4 className="text-gray-400 text-xs font-bold uppercase mb-2">Topics Covered</h4>
                          <ul className="list-disc list-inside text-gray-300 text-sm">
                              {contentDetails.headings.map((head, i) => (
                                  <li key={i}>{head}</li>
                              ))}
                          </ul>
                      </div>
                  )}
               </div>
          </div>
      )}
    </div>
  );
};

export default VisualDisplay;