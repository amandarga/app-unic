import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Hook genérico de persistência local. TODA leitura/escrita de storage passa
// por aqui (regra do CLAUDE.md).
//
//   const [valor, setValor, carregando] = useStorage<T>(chave, inicial);
//
// - Lê do AsyncStorage ao montar (JSON); grava ao setar.
// - Semente-no-primeiro-uso: se a chave estiver vazia, usa `inicial` e o persiste.
// - Camada de assinatura em memória por chave: vários consumidores da MESMA chave
//   ficam em sincronia (ex.: criar um app no modal reflete na Home na hora).

type Entry<T> = {
  value: T;
  loaded: boolean;
  loading?: Promise<void>;
  listeners: Set<(v: T) => void>;
};

const store = new Map<string, Entry<unknown>>();

function getEntry<T>(key: string, initial: T): Entry<T> {
  let entry = store.get(key) as Entry<T> | undefined;
  if (!entry) {
    entry = { value: initial, loaded: false, listeners: new Set() };
    store.set(key, entry as Entry<unknown>);
  }
  return entry;
}

function notify<T>(entry: Entry<T>) {
  entry.listeners.forEach((l) => l(entry.value));
}

async function load<T>(key: string, initial: T, entry: Entry<T>) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw != null) {
      entry.value = JSON.parse(raw) as T;
    } else {
      // semente-no-primeiro-uso: persiste o valor inicial
      entry.value = initial;
      await AsyncStorage.setItem(key, JSON.stringify(initial));
    }
  } catch {
    entry.value = initial;
  } finally {
    entry.loaded = true;
    notify(entry);
  }
}

export function useStorage<T>(key: string, initial: T): [T, (v: T) => void, boolean] {
  const entry = getEntry(key, initial);
  const [value, setLocal] = useState<T>(entry.value);
  const [carregando, setCarregando] = useState<boolean>(!entry.loaded);

  useEffect(() => {
    const listener = (v: T) => {
      setLocal(v);
      setCarregando(false);
    };
    entry.listeners.add(listener);

    if (entry.loaded) {
      // já carregado por outra instância — sincroniza este consumidor
      listener(entry.value);
    } else if (!entry.loading) {
      entry.loading = load(key, initial, entry);
    }

    return () => {
      entry.listeners.delete(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (v: T) => {
    entry.value = v;
    notify(entry); // atualiza todos os consumidores (inclui este)
    AsyncStorage.setItem(key, JSON.stringify(v)).catch(() => {});
  };

  return [value, setValue, carregando];
}
