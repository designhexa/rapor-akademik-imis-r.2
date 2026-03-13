-- Create kelas table
CREATE TABLE public.kelas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kelas TEXT NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kelas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kelas
CREATE POLICY "Everyone can view kelas"
ON public.kelas
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and Koordinator can manage kelas"
ON public.kelas
FOR ALL
USING (has_role(auth.uid(), 'Admin'::app_role) OR has_role(auth.uid(), 'Koordinator'::app_role));

-- Add kelas_id to santri table
ALTER TABLE public.santri
ADD COLUMN id_kelas UUID REFERENCES public.kelas(id) ON DELETE SET NULL;

-- Create trigger for updated_at on kelas
CREATE TRIGGER update_kelas_updated_at
BEFORE UPDATE ON public.kelas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();