import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ModelsService {
  constructor(private readonly supabaseService: SupabaseService) {}

async getModels(categoryId?: string) {
  let query = this.supabaseService.client
    .from('models')
    .select('*')
    .order('id', { ascending: true });

  if (categoryId) {
    query = query.eq('category_id', categoryId); // ✅ FIX
  }

  const { data, error } = await query;

  if (error) {
    console.error(error); // 🔥 خليها
    throw new Error(`Failed to fetch models: ${error.message}`);
  }

  return data;
}

async getModelById(id: string) {
  const { data, error } = await this.supabaseService.client
    .from('models')
    .select('*')
    .eq('id', id) // ✅ FIX
    .single();

  if (error) {
    console.error('SUPABASE ERROR:', error); // 🔥 مهم
    throw new Error(error.message);
  }

  return data;
}
}
