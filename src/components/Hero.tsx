
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProposalButton from "./ProposalButton";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
              <span className="text-primary">Custom</span> Business Applications <span className="text-primary">at a Flat Rate</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md">
              No hourly billing, no hidden costs. Custom-built from scratch specifically for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ProposalButton size="lg" className="font-semibold w-full sm:w-auto">
                Get My Custom Proposal
              </ProposalButton>
              <Button size="lg" variant="outline" className="font-semibold w-full sm:w-auto" onClick={() => navigate('/apps')}>
                Browse Apps
              </Button>
            </div>
            <div className="pt-2 md:pt-4">
              <p className="text-sm text-muted-foreground">
                Transparent pricing: $5K standard apps, $7.5K AI-enhanced. No hidden fees.
              </p>
            </div>
          </div>
          
          <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden shadow-2xl">
            {/* Enhanced multi-layered gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/40 animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-blue-400/25 animate-[pulse_4s_ease-in-out_infinite_1s]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3),transparent_70%)]" />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]" />
            
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-3 sm:gap-3 sm:p-4 md:gap-4 md:p-6 lg:p-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 md:p-4 flex flex-col justify-between transform hover:scale-105 transition-transform">
                <div className="flex justify-between">
                  <div className="h-3 sm:h-4 md:h-5 lg:h-6 w-3 sm:w-4 md:w-5 lg:w-6 rounded-md bg-blue-500" />
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold bg-gray-100 text-gray-800 px-1 sm:px-2 py-0.5 rounded">CRM</span>
                </div>
                <div>
                  <div className="h-2 sm:h-3 md:h-4 w-3/4 bg-gray-200 rounded mb-1 sm:mb-2" />
                  <div className="h-1 sm:h-2 md:h-3 w-full bg-gray-100 rounded" />
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 md:p-4 flex flex-col justify-between transform hover:scale-105 transition-transform">
                <div className="flex justify-between">
                  <div className="h-3 sm:h-4 md:h-5 lg:h-6 w-3 sm:w-4 md:w-5 lg:w-6 rounded-md bg-green-500" />
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold bg-blue-100 text-blue-800 px-1 sm:px-2 py-0.5 rounded">AI</span>
                </div>
                <div>
                  <div className="h-2 sm:h-3 md:h-4 w-3/4 bg-gray-200 rounded mb-1 sm:mb-2" />
                  <div className="h-1 sm:h-2 md:h-3 w-full bg-gray-100 rounded" />
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 md:p-4 flex flex-col justify-between transform hover:scale-105 transition-transform">
                <div className="flex justify-between">
                  <div className="h-3 sm:h-4 md:h-5 lg:h-6 w-3 sm:w-4 md:w-5 lg:w-6 rounded-md bg-purple-500" />
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold bg-gray-100 text-gray-800 px-1 sm:px-2 py-0.5 rounded">POS</span>
                </div>
                <div>
                  <div className="h-2 sm:h-3 md:h-4 w-3/4 bg-gray-200 rounded mb-1 sm:mb-2" />
                  <div className="h-1 sm:h-2 md:h-3 w-full bg-gray-100 rounded" />
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 md:p-4 flex flex-col justify-between transform hover:scale-105 transition-transform">
                <div className="flex justify-between">
                  <div className="h-3 sm:h-4 md:h-5 lg:h-6 w-3 sm:w-4 md:w-5 lg:w-6 rounded-md bg-orange-500" />
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold bg-blue-100 text-blue-800 px-1 sm:px-2 py-0.5 rounded">AI</span>
                </div>
                <div>
                  <div className="h-2 sm:h-3 md:h-4 w-3/4 bg-gray-200 rounded mb-1 sm:mb-2" />
                  <div className="h-1 sm:h-2 md:h-3 w-full bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
