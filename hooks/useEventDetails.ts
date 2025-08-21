import { useState, useEffect } from 'react';
import { EventService } from '../services/eventService';
import { Evento } from '../types/api';

export function useEventDetails(eventId: string) {
	const [evento, setEvento] = useState<Evento | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (eventId) {
			loadEventDetails();
		}
	}, [eventId]);

	async function loadEventDetails() {
		try {
			setLoading(true);
			setError(null);
			
			const result = await EventService.getEventDetails(eventId);

			if (result.success && result.data) {
				console.log('📅 Detalhes do evento carregados:', result.data);
				setEvento(result.data);
			} else {
				console.error('❌ Erro ao carregar evento:', result.error);
				setError(result.error || 'Erro ao carregar detalhes do evento');
			}
		} catch (error) {
			console.error('Erro ao carregar evento:', error);
			setError('Erro de conexão. Verifique sua internet.');
		} finally {
			setLoading(false);
		}
	}

	function refresh() {
		loadEventDetails();
	}

	return {
		evento,
		loading,
		error,
		refresh
	};
}
