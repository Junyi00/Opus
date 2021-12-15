module Api
	module V1
		class ProjectLanesController < ApplicationController
			protect_from_forgery with: :null_session

			def show
				lanes = Lane.filter_by_project_id(params[:project_id])

				render json: LaneSerializer.new(lanes).serializable_hash.to_json
			end


		end
	end
end