import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Baby, ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export function BabySetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    ageInDays: 1,
    birthDate: ""
  });

  const setupMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.baby.setup.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save baby profile");

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Saved",
        description: "Your baby's profile has been created.",
      });
      setLocation("/dashboard");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex-center px-4 bg-gradient-to-br from-[hsl(var(--primary))/5] via-background to-[hsl(var(--secondary))/5]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-[2rem] shadow-xl">
          <div className="flex-center flex-col text-center mb-8">
            <div className="w-16 h-16 bg-[hsl(var(--primary))/10] rounded-2xl flex-center mb-4">
              <Baby className="w-8 h-8 text-[hsl(var(--primary))]" />
            </div>
            <h1 className="text-3xl font-display font-bold">Baby Profile</h1>
            <p className="text-muted-foreground mt-2">
              Let's set up your baby's basic information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Baby's Name</label>
              <input
                required
                className="w-full px-5 py-4 rounded-2xl bg-black/5 border-transparent focus:bg-white focus:border-[hsl(var(--primary))/30] outline-none transition-all font-medium"
                placeholder="Enter baby's name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Gender</label>
                <select
                  className="w-full px-5 py-4 rounded-2xl bg-black/5 border-transparent focus:bg-white focus:border-[hsl(var(--primary))/30] outline-none transition-all font-medium appearance-none"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Age (Days)</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-5 py-4 rounded-2xl bg-black/5 border-transparent focus:bg-white focus:border-[hsl(var(--primary))/30] outline-none transition-all font-medium"
                  value={formData.ageInDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageInDays: parseInt(e.target.value)
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">
                Date of Birth (Optional)
              </label>
              <input
                type="date"
                className="w-full px-5 py-4 rounded-2xl bg-black/5 border-transparent focus:bg-white focus:border-[hsl(var(--primary))/30] outline-none transition-all font-medium"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
              />
            </div>

            <button
              disabled={setupMutation.isPending}
              className="w-full py-4 rounded-2xl bg-[hsl(var(--primary))] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex-center gap-2 disabled:opacity-70"
            >
              {setupMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Save & Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}